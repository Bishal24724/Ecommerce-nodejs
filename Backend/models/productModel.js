import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Product name is required']
    },
    description:{
        type:String,
        required:[true,'Product description is required']
    },
    price:{
        type:Number,
        required:[true,'Product price is required']
    },
    stock:{
        type:Number,
        required:[true,'Product stock is required']
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    images:[
        {
            public_id:String,
            url:String
        }
    ]
},
{
    timestamps:true
})
const productModel= mongoose.model("Products",productSchema);
 export default productModel;