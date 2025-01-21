
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // Validate token presence
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Please log in first",
      });
    }

    // Verify token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await userModel.findById(decodedData._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // Attach user data to request
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    res.status(401).send({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

export const isAdmin= async(req,res,next)=>{
  if(req.user.role!='admin'){
    return res.status(401).send({
      success:false,
      message:"You have no permission",
    });
  }
  next();
}

