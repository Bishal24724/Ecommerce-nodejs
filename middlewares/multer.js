

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create the uploads directory if it doesn't exist
// const uploadDir = path.join("uploads", "profile-pics");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); // Save files in the local `uploads/profile-pics` folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName); // Save the file with a unique name
//   },
// });

// export const singleUpload = multer({ storage }).single("file");






import multer from "multer";
import path from "path";
import fs from "fs";

// Helper function to create upload directories dynamically
const makeUploadDir = (folder) => {
  const uploadDir = path.join("uploads", folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Storage configuration for profile pictures
const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = makeUploadDir("profile-pics"); // Directory for profile pics
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Storage configuration for product images
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = makeUploadDir("products"); // Directory for product images
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Multer middleware for profile picture uploads
export const singleUpload = multer({ storage: profilePicStorage }).single("file");

// Multer middleware for product image uploads
export const productImageUpload = multer({ storage: productImageStorage }).array("files", 10);



