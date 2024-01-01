import JWT from "jsonwebtoken";
import User from "../models/user.model.js";

// Protected routes token base
export const requireSignIn = async (req, res, next) => {
  // console.log(req.headers.authorization);
  try {
    const decoded = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Unauthorized access",
      success: false,
    });
  }
};

// Check whether admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 1) {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
