import Stripe from "stripe";
import crypto from 'crypto';
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16' // Use the latest API version
});
import Order from "../models/orderModel.js";

import Razorpay from "razorpay";
import User from "../models/userModel.js";



//global variable
const currency = "USD"
const deliveryCharge =10

// placeOrder Using COD methods
 const placeOrder = async (req, res) => {
  try {
    const { items, address, amount, cartData } = req.body;
    const userId = req.user.id;

    // Validation
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Missing or invalid items/userId" 
      });
    }

    if (!address || typeof address !== "object" || !address.street || !address.city) {
      return res.status(400).json({ 
        success: false,
        message: "Missing or invalid address" 
      });
    }

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ 
        success: false,
        message: "Missing or invalid amount" 
      });
    }

    // Create order
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: req.body.paymentMethod || "COD",
      payment: req.body.paymentMethod !== "COD", // Mark as paid if not COD
      status: "Processing",
      date: new Date(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Clear user's cart if cartData is provided
    if (cartData) {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    }

    return res.status(200).json({ 
      success: true,
      message: "Order placed successfully", 
      order: newOrder 
    });

  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};



export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ date: -1 });
    
    res.status(200).json({ 
      success: true,
      orders 
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Place order using Stripe
const placeOrderStripe = async (req, res) => {
  try {
    // Validate Stripe is properly initialized
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { items, address, amount, cartData } = req.body;
    const userId = req.user.id;
    const { origin } = req.headers;

    // Validate required fields
    if (!userId || !items?.length || !address || !amount || !origin) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Create order record
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      status: "Processing",
      date: new Date(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Prepare line items for Stripe
    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image[0]] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add delivery fee if applicable
    const deliveryCharge = 10; // or get from config
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Delivery Fee',
        },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString()
      },
    });

    // Clear cart if cartData exists
    if (cartData) {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    }

    return res.json({
      success: true,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Payment processing failed',
      error: error.type || 'StripeError'
    });
  }
  
};

const verifyStripe =async (req,res) => {
  const{orderId,success,userId}= req.body
  try {
    if (success=== "true") {
      await Order.findByIdAndUpdate(orderId,{payment:true});
      await User.findByIdAndUpdate(userId,{cartData:{}});
      res.json({success:true})
    }else{
      await Order.findByIdAndDelete(orderId)
      res.json({success:false})
    }
  } catch (error) {
    console.error('Stripe Error:', error);
    res.json({success:false,message:error.message})
  }   
}




// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Place order using Razorpay
// Place order using Razorpay
const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, address, amount, cartData } = req.body;
    const userId = req.user.id;
    const { origin } = req.headers;

    // Validate required fields
    if (!userId || !items?.length || !address || !amount || !origin) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create order record
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Processing",
      date: new Date(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Convert amount to paise and ensure it's an integer
    const amountInPaise = Math.round(amount * 100); // Ensure it's an integer

    // Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
      notes: {
        orderId: newOrder._id.toString(),
        userId: userId.toString()
      }
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Optionally clear cart
    if (cartData) {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    }

    return res.json({
      success: true,
      razorpayOrder,
      orderId: newOrder._id,
      key: process.env.RAZORPAY_KEY_ID, // Send Razorpay key to frontend
      redirectUrl: `${origin}/orders` // Add redirect URL
    });

  } catch (error) {
    console.error("Error placing order with Razorpay:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// all order data for admin panel
const allOrders = async (req, res) => {
    try {
      const orders = await Order.find({});
      res.status(200).json({ orders });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  


// Get user orders
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from JWT token by auth middleware

    // Find all orders for this user, sorted by date (newest first)
    const orders = await Order.find({ userId })
      .sort({ date: -1 }) // Sort by date descending
      .lean(); // Convert to plain JS objects

    if (!orders || orders.length === 0) {
      return res.status(200).json({ 
        success: true, 
        orders: [], 
        message: "No orders found for this user" 
      });
    }

    res.status(200).json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Verify Razorpay payment
// In your backend route (e.g., /api/order/verify-razorpay)

 const verifyRazorpay = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Generate the expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Verify the signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid signature" 
      });
    }

    // Update order status in database
    await Order.findByIdAndUpdate(orderId, { 
      payment: true,
      status: "Paid"
    });

    res.json({ 
      success: true,
      message: "Payment verified successfully" 
    });

  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

  

// update order status fom admin pannel
const updateStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body;
  
      if (!orderId || !status) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const order = await Order.findByIdAndUpdate(orderId ,{status});
             res.status(200).json({success:true, message:"status updated" });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      order.status = status; // Update the status
  
      await order.save();
      res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  export {placeOrder,placeOrderRazorpay,placeOrderStripe,allOrders,updateStatus,userOrders,verifyStripe,verifyRazorpay}
  







