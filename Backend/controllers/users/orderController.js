import axios from "axios";
import orderModel from "../../models/orderModel.js";
import cartModel from "../../models/cartModel.js";

// eSewa Configurations
const ESEWA_TEST_URL = "https://uat.esewa.com.np/epay/main";
const ESEWA_VERIFY_URL = "https://uat.esewa.com.np/epay/transrec";
const MERCHANT_CODE = "EPAYTEST";


export const createOrder = async (req, res) => {
  try {
    const { name, phone, deliveryAddress } = req.body;

    
    const cart = await cartModel.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ success: false, message: "Cart is empty. Cannot place an order." });
    }

    const totalAmount = cart.totalPrice;

    // Validate stock for each item in the cart
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return res.status(400).send({
          success: false,
          message: `Insufficient product for ${product.name}.please decrease your order quantity`,
        });
      }
    }

    // stock decrease in product table
    for (const item of cart.items) {
      const product = item.product;
      product.stock -= item.quantity;
      await product.save(); 
    }

    // Create a new order
    const newOrder = await orderModel.create({
      user: req.user._id,
      name,
      phone,
      deliveryAddress,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      payment: { pidx: `order-${Date.now()}`, status: "Unpaid" },
    });

    // Clear the user's cart after the order is created
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Prepare eSewa payment URL
    const paymentURL = `${ESEWA_TEST_URL}?amt=${totalAmount}&tAmt=${totalAmount}&psc=0&pdc=0&pid=${newOrder.payment.pidx}&scd=${MERCHANT_CODE}&su=http://localhost:8000/api/v1/order/esewa-success&fu=http://localhost:8000/api/v1/order/esewa-failure`;

    res.status(200).send({ success: true, paymentURL });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to create order", error: error.message });
  }
};


// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { amt, pid } = req.query;

    const verifyURL = `${ESEWA_VERIFY_URL}?amt=${amt}&pid=${pid}&scd=${MERCHANT_CODE}`;

    const response = await axios.get(verifyURL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 5000,
    });

    if (response.data.includes("<response_code>Success</response_code>")) {
      const order = await orderModel.findOneAndUpdate(
        { "payment.pidx": pid },
        { "payment.status": "Paid", status: "Processing" },
        { new: true }
      );

      if (!order) {
        return res.status(404).send({ success: false, message: "Order not found" });
      }

      return res.status(200).send({ success: true, message: "Payment verified successfully", order });
    } else {
      return res.status(400).send({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("eSewa verification error:", error.message);
    res.status(500).send({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
   
    const userOrders = await orderModel
      .find({ user: req.user._id })
      .populate("items.product", "name price") 
      .sort({ createdAt: -1 }); 

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).send({
      success: true,
      orders: userOrders,
    });
  } catch (error) {
    console.error("Error retrieving user's orders:", error.message);
    res.status(500).send({
      success: false,
      message: "Failed to fetch user's orders",
      error: error.message,
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

   
    const order = await orderModel
      .findOne({ _id: orderId, user: req.user._id })
      .populate("items.product", "name price stock");

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found or does not belong to the user",
      });
    }

    res.status(200).send({
      success: true,
      message: "Order details retrieved successfully",
      order,
    });
  } catch (error) {
    console.error("Error retrieving order details:", error.message);
    res.status(500).send({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};
