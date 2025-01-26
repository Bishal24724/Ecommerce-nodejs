import express from "express";

import { deleteReview,getProductReviews } from "../../controllers/admin/reviewController.js";
import { isAdmin,isAuth } from "../middlewares/authMiddleware.js";

const router= express.Router();
router.delete("/delete/:reviewId", isAuth,isAdmin, deleteReview);
router.get("/:productId", getProductReviews);

export default router;

