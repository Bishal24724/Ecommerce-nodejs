import express from "express";
import { isAuth,isAdmin } from "../../middlewares/authMiddleware.js";
import { createCategory, getAllCategories,deleteCategory,updateCategory } from "../../controllers/admin/categoryController.js";

const router=express.Router();

router.post("/create",isAuth,isAdmin,createCategory);
router.get("/get-all",isAuth,isAdmin,getAllCategories);
router.delete("/delete/:id",isAuth,isAdmin,deleteCategory);
router.put("/update/:id",isAuth,isAdmin,updateCategory);


export default router;