import express from "express";
import {
  registerController,
  loginController,
  getUserProfileController,
  logoutController,
  updateProfileController,
  updatePasswordController,
  updateProfilePicController,

} from "../../controllers/users/userController.js";
import {isAuth} from "../../middlewares/authMiddleware.js";
import { singleUpload } from "../../middlewares/multer.js";
import { rateLimit } from 'express-rate-limit';

//rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
})

const router = express.Router();

router.post("/register",limiter, registerController);

//login

router.post("/login", limiter,loginController);

//profile
router.get('/profile',isAuth,getUserProfileController);


//logout
router.get('/logout',isAuth,logoutController);

//update user profile

router.put('/profile-update',isAuth,updateProfileController)

router.put('/update-password',isAuth,updatePasswordController)

router.put('/update-picture',isAuth,singleUpload,updateProfilePicController);

export default router;
