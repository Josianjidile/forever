import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/authUser.js";
import { allOrders, placeOrder, placeOrderRazorpay, placeOrderStripe, updateStatus, userOrders, verifyRazorpay, verifyStripe } from "../controllers/orderController.js";




const orderRouter = express.Router();

//   admin features
 orderRouter.post("/list",adminAuth,allOrders); 
 orderRouter.post("/status",adminAuth,updateStatus); 


 
//   payment features
orderRouter.post("/place",authUser,placeOrder); 
orderRouter.post("/stripe",authUser,placeOrderStripe); 
orderRouter.post("/razorpay",authUser,placeOrderRazorpay); 

//   user features
orderRouter.post("/userorders",authUser,userOrders); 

//   verify payment
orderRouter.post("/verifyStripe",authUser,verifyStripe); 
orderRouter.post("/verifyRazorpay",authUser,verifyRazorpay);


export default orderRouter;