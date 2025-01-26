
import reviewModel from "../../models/reviewModel.js";
import productModel from "../../models/productModel.js";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

   
    const existingReview = await reviewModel.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).send({
        success: false,
        message: "You have already reviewed this product",
      });
    }

   
    const review = await reviewModel.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    res.status(201).send({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).send({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel
      .find({ product: productId })
      .populate("user", "name email")
      .populate("product", "name");

    res.status(200).send({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send({
      success: false,
      message: "Failed to call api",
      error: error.message,
    });
  }
};


  
