import express from "express";
import { createOrder, verifyPayment, getMyOrders, getOrderDetails } from "../../controllers/users/orderController.js";
import { isAuth } from "../../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/create", isAuth, createOrder);


router.get("/verify", verifyPayment);


router.get("/my-order",isAuth,getMyOrders);
router.get("/order-details/:orderId",isAuth,getOrderDetails);

export default router;
