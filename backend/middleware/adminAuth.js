import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // Get token from headers
    const {token }= req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access Denied: No token provided" });
    }

    // Verify token
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (token_decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: "Invalid Token" });
    }

    next(); // Move to the next middleware/controller
  } catch (error) {
    res.status(401).json({ success: false, message:error.message });
  }
};

export default adminAuth;