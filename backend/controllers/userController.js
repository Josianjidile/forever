import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator"; // Ensure validator is imported

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// User Login Route
const userLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      const token = createToken(user._id);
  
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  

// User Registration Route
const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the password length is at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Use newUser._id instead of user._id
    const token = createToken(newUser._id);

    res.status(201).json({ token, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login Route
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
    
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        } else {
          res.json({ success: false, message: "Invalid credentials" });
        }
      } catch (error) {
        console.log(error);
        res.json({ success: false, error: message.error });
      }
};

export { userLogin, userRegister, adminLogin };
