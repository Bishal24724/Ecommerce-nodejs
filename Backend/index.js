import express from 'express';
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";

import userRoutes from "./routes/users/userRoutes.js";
import connectDB from "./config/db.js";

import path from "path";
import productRoutes from "./routes/users/productRoutes.js";
import categoryRoutes from "./routes/admin/categoryRoutes.js";
import cartRoutes from "./routes/users/cartRoutes.js";
import orderRoutes from "./routes/users/orderRoutes.js";
import adminOrderRoutes from "./routes/admin/orderRoutes.js";
import adminProductRoutes from "./routes/admin/productRoutes.js";
import  reviewRoutes from './routes/users/reviewRoutes.js';
import  adminReviewRoutes from './routes/admin/reviewRoutes.js';




//dot env config

dotenv.config();

//database connection
connectDB();



const app= express();


//middlewares

app.use(morgan("dev"));

app.use(express.json());

app.use(cors());
app.use(cookieParser());

//use routes

app.use("/api/user",userRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/category',categoryRoutes);

app.use('/api/product',productRoutes);
app.use('/api/admin/product',adminProductRoutes);

app.use('/api/cart',cartRoutes)



app.use("/api/order", orderRoutes);
app.use("/api/admin/order", adminOrderRoutes);

app.use("/api/review",reviewRoutes);
app.use("/api/admin/review",adminReviewRoutes);

app.get('/',(req,res)=>{
    return res.status(200).send("<h1>Welcome to node </h1>" );
});



app.listen(process.env.PORT,()=>{
    console.log(`server is running on port 8000 ${process.env.PORT} on ${process.env.NODE_ENV} Mode` );
});


