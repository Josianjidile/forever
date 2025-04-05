import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
  
    items: {
      type: Array,
      required: true,
    },
    amount: {
        type: Number,
        required: true,
      },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "order placed", // Default status when the order is placed
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    payment: {
      type: Boolean,
      required: true,
      default: false, // Default to false since the order might not be paid yet
    },
    date: {
      type: Number,
      required: true, // Date in timestamp format
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
