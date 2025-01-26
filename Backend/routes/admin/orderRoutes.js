import express from "express";
import {
  getAllOrders,
  changeOrderStatusController,
} from "../controllers/admin/orderController.js";
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin/get-all", isAuth, isAdmin, getAllOrders);

router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;
