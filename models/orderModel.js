import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      name: {
        type: String,
        required: [true, "Name is required"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
      deliveryAddress: {
        street: { type: String, required: [true, "Street is required"] },
        city: { type: String, required: [true, "City is required"] },
        postalCode: { type: String, required: [true, "Postal Code is required"] },
        country: { type: String, required: [true, "Country is required"] },
      },
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
      totalAmount: { type: Number, required: true },
      status: {
        type: String,
        enum: ["Pending", "Processing", "Delivered","Shipped","Cancelled"],
        default: "Pending",
      },
      payment: {
        pidx: { type: String }, 
        status: {
          type: String,
          enum: ["Unpaid", "Paid"],
          default: "Unpaid",
        },
        paymentMethod: {
          type: String,
          enum: ["eSewa"], 
          default: "eSewa",
        },
      },
    deliveredAt:Date,
    },
    { timestamps: true }
  );
  
  export const orderModel = mongoose.model("Order",orderSchema);
  export default orderModel;