
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
    const uploadDir = makeUploadDir("profile-pics"); 
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
    const uploadDir = makeUploadDir("products"); 
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



