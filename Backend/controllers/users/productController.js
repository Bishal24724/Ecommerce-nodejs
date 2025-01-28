import productModel from "../models/productModel.js";
import mongoose from "mongoose";

export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find({});
    console.log(products);
    res.status(200).send({
      success: true,
      message: "all product fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in all product api",
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    //validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "product found",
      product,
    });
  } catch (error) {
    console.log(error);

    if (error.code === "CastError") {
      return res.status(505).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in single product api",
    });
  }
};


export const getProductsByNameController = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "name  cannot be empty",
      });
    }

    const regex = new RegExp(name, "i");
    const products = await productModel.find({ name: regex });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found matching your search",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in search products API",
      error: error.message,
    });
  }
};
