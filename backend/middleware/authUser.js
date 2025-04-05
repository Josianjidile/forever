import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user ID to req.user (not req.body)
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
};

export default authUser;

