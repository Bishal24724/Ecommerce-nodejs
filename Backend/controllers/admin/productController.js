import productModel from "../../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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

//
export const CreateProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate files
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Product images are required",
      });
    }

    // Prepare image data
    const images = req.files.map((file) => ({
      url: `/uploads/products/${file.filename}`,
    }));

    // Save product to the database
    await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      images,
    });

    res.status(201).send({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating the product",
    });
  }
};


//update product
export const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    const { name, description, price, category, stock } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    // Handle image updates if files are uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/products/${file.filename}`,
      }));

      // Append new images to the existing ones
      product.images.push(...newImages);

      // Replace old images with new ones (optional: you can append instead of replacing)
      // product.images = newImages;
    }
    // Save product data to the database
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in update product api",
    });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    // Delete images from the filesystem
    for (let index = 0; index < product.images.length; index++) {
      const image = product.images[index];
      const filePath = path.join(
        __dirname,
        "../uploads/products",
        image.url.split("/").pop()
      );
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      }
    }

    // Delete product from the database
    await productModel.deleteOne({ _id: req.params.id });

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete product API",
    });
  }
};

export const deleteProductIndividualImage = async (req, res) => {
  try {
    const { id, imgId } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid product ID" });
    }

    console.log("Product ID:", id);
    console.log("Image ID:", imgId);

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    const imageIndex = product.images.findIndex((img) => img._id == imgId); 

    if (imageIndex === -1) {
      return res
        .status(404)
        .send({ success: false, message: "Image not found" });
    }

    const image = product.images[imageIndex];
    console.log("Found Image:", image);

    // Delete the image file from the filesystem
    if (image.url) {
      const filePath = path.join(
        __dirname,
        "../uploads/products",
        image.url.split("/").pop()
      );
      console.log("File Path:", filePath);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      }
    }

    // Remove the image from the product's images array
    product.images.splice(imageIndex, 1);
    await product.save();

    res.status(200).send({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in delete product image API",
    });
  }
};

export const deleteProductAllImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid product ID" });
    }

    // Fetch the product
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    // Iterate over all images and delete them from the file system
    for (const image of product.images) {
      if (image.url) {
        const filePath = path.join(
          __dirname,
          "../uploads/products",
          image.url.split("/").pop()
        );
        try {
          fs.unlinkSync(filePath); // Delete the file
        } catch (err) {
          console.error(`Error deleting file: ${filePath}`, err);
        }
      }
    }

    // Clear the images array
    product.images = [];
    await product.save();

    res.status(200).send({
      success: true,
      message: "All product images deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in delete all product images API",
    });
  }
};

// search product by name controller function

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
