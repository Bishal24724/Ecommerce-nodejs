import axios from "axios";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";



// Verify Payment

export const getAllOrders = async (req, res) => {
  try {
    // Retrieve all orders, including user and item details
    const orders = await orderModel
      .find()
      .populate("user", "name email") 
      .populate("items.product", "name price"); 

    if (!orders || orders.length === 0) {
      return res.status(404).send({ success: false, message: "No orders found" });
    }

    res.status(200).send({ success: true, orders });
  } catch (error) {
    console.error("Error retrieving orders:", error.message);
    res.status(500).send({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

export const changeOrderStatusController= async(req,res)=>{

     try {
           const order= await orderModel.findById(req.params.id)
           if(!order){
            return res.status(404).send(
              {
                success:false,
                message:"order not found",
              }
            );
           }
           if(order.status==="Pending") order.status= "Processing"
           else if(order.status=="Processing") order.status= "Shipped"
           else if(order.status=="Shipped"){
            order.status="Delivered"
            order.deliveredAt=  Date.now()
           }else{
            return res.status(500).send({
              success:false,
              message:"order already delivered"
            })
          }
            await order.save()
            res.status(200).send({
              success:true,
              message:"Order status has been updated succesfully"
            });
           
      
     } catch (error) {
            console.error(error)
            res.status(500).send({
              success:False,
              message:"error while changing order status "
            });
     }
}


