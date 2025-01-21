import express from "express";
import {
  registerController,
  loginController,
  getUserProfileController,
  logoutController,
  updateProfileController,
  updatePasswordController,
  updateProfilePicController,

} from "../controllers/userController.js";
import {isAuth} from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerController);

//login

router.post("/login", loginController);

//profile
router.get('/profile',isAuth,getUserProfileController);


//logout
router.get('/logout',isAuth,logoutController);

//update user profile

router.put('/profile-update',isAuth,updateProfileController)

router.put('/update-password',isAuth,updatePasswordController)

router.put('/update-picture',isAuth,singleUpload,updateProfilePicController);

export default router;
