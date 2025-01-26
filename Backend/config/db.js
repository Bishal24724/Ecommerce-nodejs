import mongoose from "mongoose";

const connectDB= async ()=>{
    try {
           await mongoose.connect(process.env.MONGO_URL);
           console.log("MongoDB connected");
    } catch (error) {
        console.log(`mongodb error ${error}`)
    }
}

export default connectDB;