import userModel from "../models/userModel.js";
import { getDataUri } from "../utils/feature.js";
import fs from "fs";
// import cloudinary from "cloudinary";

export const registerController = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging request payload
    const { name, email, password, address, city, country, phone } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Check for existing user by email
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create user
    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
    });

    return res.status(200).json({
      message: "Registration successful",
      success: true,
      user, // You can also return the created user data
    });
  } catch (error) {
    console.log("Error:", error);

    // Handle validation error after catch
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error while registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    //check password

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }

    //token

    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "logged in successfully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error is in login api",
      error,
    });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "user profile fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in profile api",
      error,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "logout successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in profile api",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // validation and update

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).send({
      success: true,
      message: "profile updated successfully",
      user,
    });
  } catch (error) {}
};

//update user password

export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    //validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "please provide new or old password",
      });
    }

    // check old password
    const isMatch = await user.comparePassword(oldPassword);
    //validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid old password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {}
};

// export const updateProfilePicController = async (req, res) => {
//   try {
   
//     const user = await userModel.findById(req.user._id);

//     //file get from client photo
//     const file = getDataUri(req.file);

//     //delete prev image
//     //await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

//     //update
//     const cbd = await cloudinary.v2.uploader.upload(file.content);

//     user.profilePic = {
//       public_id: cbd.public_id,
//       url: cbd.secure_url,
//     };

//     //save func
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "profile picture updated successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in profile pic upload api",
//       error,
//     });
//   }
// };

export const updateProfilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No file uploaded",
      });
    }

    // Remove the old profile picture if it exists
    if (user.profilePic?.url) {
      const oldFilePath = `./${user.profilePic.url}`;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Delete the old file
      }
    }

    // Save the new file details in the database
    user.profilePic = {
      public_id: req.file.filename, // Use the filename as the public ID
      url: req.file.path, // Save the relative file path
    };

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in profile picture update API",
      error,
    });
  }
};


