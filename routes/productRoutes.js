import express from "express";
import { 
  CreateProductController, 
  getAllProductsController, 
  getSingleProductController, 
  updateProductController,
  deleteProductController,
  deleteProductIndividualImage,
  deleteProductAllImages,
  getProductsByNameController
} from "../controllers/productController.js";
import { isAuth,isAdmin } from "../middlewares/authMiddleware.js";
import { productImageUpload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/search", getProductsByNameController);
router.get('/get-all', getAllProductsController);
router.get("/:id", getSingleProductController);


router.post('/create', isAuth, isAdmin,productImageUpload, CreateProductController);
router.put('/:id',isAuth,isAdmin,productImageUpload,updateProductController);

router.delete("/delete/:id",isAuth,isAdmin,deleteProductController)
router.delete("/delete/:id/image/:imgId",isAuth,isAdmin,deleteProductIndividualImage);
router.delete("/delete-all-images/:id", isAuth,isAdmin,deleteProductAllImages);


export default router;

