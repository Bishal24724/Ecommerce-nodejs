import express from "express";

import { createReview,getProductReviews } from "../../controllers/users/reviewController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router= express.Router();
router.post("/create", isAuth, createReview);
router.get("/:productId", getProductReviews);

export default router;

