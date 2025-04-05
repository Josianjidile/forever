import React, { useState, useContext, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/cartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios"; 


const PlaceOrder = () => {
  const {
    navigate,
    cartItems,
    backendUrl,
    token,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    currency,
  } = useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) return Promise.resolve();

      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          console.error('Razorpay SDK failed to load');
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'phone'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add this onChangeHandler function
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ 
      ...prevData, 
      [name]: value 
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({ 
        ...prevErrors, 
        [name]: '' 
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const initRazorpayPayment = async (razorpayOrder, orderId) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please try again.");
      return;
    }
  
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount.toString(),
      currency: razorpayOrder.currency || "INR",
      name: "FOREVER",
      description: "Order Payment",
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          const verificationResponse = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            {
              orderId: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            },
            { headers: { token } }
          );
  
          if (verificationResponse.data.success) {
            toast.success("Payment successful! Your order has been placed.");
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(verificationResponse.data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: "#3399cc"
      }
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }
  
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
  
    if (Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const orderItems = [];
  
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const product = products.find(p => p._id === itemId);
            if (product) {
              orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                size: size,
                quantity: cartItems[itemId][size],
                image: product.image
              });
            }
          }
        }
      }
  
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        cartData: cartItems
      };
  
      switch (paymentMethod) {
        case 'cod':
          const response = await axios.post(
            `${backendUrl}/api/order/place`, 
            orderData, 
            { headers: { token } }
          );
          
          if (response.data.success) {
            toast.success("Order placed successfully!");
            setCartItems({});
            navigate('/orders');
          } else {
            throw new Error(response.data.message || "Failed to place order");
          }
          break;
  
        case 'stripe':
          const responseStripe = await axios.post(
            `${backendUrl}/api/order/stripe`, 
            orderData, 
            { 
              headers: { 
                token,
                origin: window.location.origin 
              } 
            }
          );
          
          if (responseStripe.data.success) {
            window.location.href = responseStripe.data.url;
          } else {
            throw new Error(responseStripe.data.message || "Failed to initiate Stripe payment");
          }
          break;
  
        case 'razorpay':
          const responseRazorpay = await axios.post(
            `${backendUrl}/api/order/razorpay`, 
            orderData, 
            { 
              headers: { 
                token,
                origin: window.location.origin
              } 
            }
          );

          if (responseRazorpay.data.success) {
            initRazorpayPayment(responseRazorpay.data.razorpayOrder, responseRazorpay.data.orderId);
          } else {
            throw new Error(responseRazorpay.data.message || "Failed to create Razorpay order");
          }
          break;
  
        default:
          throw new Error("Invalid payment method");
      }
  
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-8">
      {/* Left side - Delivery Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        
        <div className="flex gap-3">
          <div className="w-full">
            <input
              required
              onChange={onChangeHandler}
              name='firstName'
              value={formData.firstName}
              type="text"
              className={`border rounded py-2 px-4 w-full focus:outline-none focus:ring-2 ${
                formErrors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
              }`}
              placeholder="First name"
            />
            {formErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
            )}
          </div>
          <div className="w-full">
            <input
              required
              onChange={onChangeHandler}
              name='lastName'
              value={formData.lastName}
              type="text"
              className={`border rounded py-2 px-4 w-full focus:outline-none focus:ring-2 ${
                formErrors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
              }`}
              placeholder="Last name"
            />
            {formErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <input
            required
            onChange={onChangeHandler}
            name='email'
            value={formData.email}
            type="email"
            className={`border rounded py-2 px-4 w-full focus:outline-none focus:ring-2 ${
              formErrors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
            }`}
            placeholder="Email address"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <input
            required
            onChange={onChangeHandler}
            name='street'
            value={formData.street}
            type="text"
            className={`border rounded py-2 px-4 w-full focus:outline-none focus:ring-2 ${
              formErrors.street ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
            }`}
            placeholder="Street"
          />
          {formErrors.street && (
            <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>
          )}
        </div>

        <div className="flex gap-3">
          <div className="w-full">
            <input
              required
              onChange={onChangeHandler}
              name='city'
              value={formData.city}
              type="text"
              className={`border rounded py-2 px-4 w-full focus:outline-none focus:ring-2 ${
                formErrors.city ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
              }`}
              placeholder="City"
            />
            {formErrors.city && (
              <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
            )}
          </div>
          <div className="w-full">
            <input
              required
              onChange={onChangeHandler}
              name='state'
              value={formData.state}
              type="text"
              className={`border rounded py-2 px-4 w-full focus:outline-none focus:ring-2 ${
                formErrors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
              }`}
              placeholder="State"
            />
            {formErrors.state && (
              <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-full">
            <input
              onChange={onChangeHandler}
              name='zipcode'
              value={formData.zipcode}
              type="text"
              className="border border-gray-300 rounded py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Zipcode"
            />
          </div>
          <div className="w-full">
            <input
              onChange={onChangeHandler}
              name='country'
              value={formData.country}
              type="text"
              className="border border-gray-300 rounded py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Country"
            />
          </div>
        </div>

        <div>
          <input
            required
            onChange={onChangeHandler}
            name='phone'
            value={formData.phone}
            type="tel"
            className={`border rounded py-2 px-4 w-full focus:outline-none focus:ring-2 ${
              formErrors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
            }`}
            placeholder="Phone"
          />
          {formErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
          )}
        </div>
      </div>

      {/* Right side - Order Summary and Payment */}
      <div className="w-full sm:max-w-[400px] mt-8 sm:mt-0">
        <CartTotal />
        
        <div className="mt-8">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="space-y-4">
            {['stripe', 'razorpay', 'cod'].map((method) => (
              <div
                key={method}
                className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handlePaymentMethodChange(method)}
              >
                <div className={`w-5 h-5 border rounded-full flex items-center justify-center ${
                  paymentMethod === method 
                    ? 'border-orange-500 bg-orange-500' 
                    : 'border-gray-400'
                }`}>
                  {paymentMethod === method && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
                {method === 'stripe' && <img src={assets.stripe_logo} alt="Stripe" className="h-6" />}
                {method === 'razorpay' && <img src={assets.razorpay_logo} alt="Razorpay" className="h-6" />}
                {method === 'cod' && <span className="text-gray-700 text-sm font-medium">Cash on Delivery</span>}
              </div>
            ))}
          </div>
          
          <div className="w-full text-end mt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`bg-black text-white px-8 py-3 text-sm transition-colors ${
                isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'hover:bg-gray-800 active:bg-gray-700'
              }`}
            >
              {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;