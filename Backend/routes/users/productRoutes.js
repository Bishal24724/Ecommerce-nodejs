import express from "express";
import {
  getAllProductsController,
  getSingleProductController,
  getProductsByNameController,
} from "../../controllers/admin/productController.js";

const router = express.Router();

router.get("/search", getProductsByNameController);
router.get("/get-all", getAllProductsController);
router.get("/:id", getSingleProductController);

export default router;
