import express from 'express';
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

import path from "path";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";





//dot env config

dotenv.config();

//database connection
connectDB();

//cloudinary config
// cloudinary.v2.config({
//     cloud_name:process.env.CLOUDINARY_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_SECRET,
// })

const app= express();


//middlewares

app.use(morgan("dev"));

app.use(express.json());

app.use(cors());
app.use(cookieParser());

//use routes

app.use("/api/v1/user",userRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/v1/category',categoryRoutes);

app.use('/api/v1/product',productRoutes);

app.use('/api/v1/cart',cartRoutes)



app.use("/api/v1/order", orderRoutes);

app.get('/',(req,res)=>{
    return res.status(200).send("<h1>Welcome to node </h1>" );
});



app.listen(process.env.PORT,()=>{
    console.log(`server is running on port 8000 ${process.env.PORT} on ${process.env.NODE_ENV} Mode` );
});


