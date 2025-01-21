import express from "express";
import { createOrder, verifyPayment,getAllOrders, changeOrderStatusController } from "../controllers/orderController.js";
import { isAuth,isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/create", isAuth, createOrder);


router.get("/verify", verifyPayment);

router.get("/admin/get-all",isAuth,isAdmin,getAllOrders);

router.put("/admin/order/:id",isAuth,isAdmin,changeOrderStatusController)

export default router;
