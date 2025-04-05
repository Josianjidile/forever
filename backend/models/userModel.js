import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {}, 
    },
  },
  {
    timestamps: true,
    minimize: false, // Keeps empty objects in `cartData`
  }
);

const User = mongoose.model("User", userSchema);
export default User;
