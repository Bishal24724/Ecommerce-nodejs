import express from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import { addToCart,getCart,updateCartItem,removeFromCart,clearCart } from "../controllers/cartController.js";

const router=express.Router();

router.post("/item/add",isAuth,addToCart);
router.get("/item/get-all",isAuth,getCart);
// router.delete("/delete/:id",isAuth,deleteCategory);
// router.put("/update/:id",isAuth,updateCategory);
router.delete("/item/clear",isAuth,clearCart);  
router.delete("/item/delete/:id",isAuth,removeFromCart);
router.put("/item/update/:id",isAuth,updateCartItem);


export default router;