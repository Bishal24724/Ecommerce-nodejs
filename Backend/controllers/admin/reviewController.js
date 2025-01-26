
import reviewModel from "../../models/reviewModel.js";
import productModel from "../../models/productModel.js";



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

export const deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
  
    
      const review = await reviewModel.findByIdAndDelete(reviewId);
  
      if (!review) {
        return res.status(404).send({
          success: false,
          message: "Review not found",
        });
      }
  
      res.status(200).send({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).send({
        success: false,
        message: "Failed to delete review",
        error: error.message,
      });
    }
  };
  
