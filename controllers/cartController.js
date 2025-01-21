import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Add an item to the cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if user already has a cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Check if product is already in the cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // Update quantity of existing item
        existingItem.quantity += quantity;
      } else {
        // Add new product to the cart
        cart.items.push({ product: productId, quantity });
      }

      // Update total price
      cart.totalPrice += product.price * quantity;
    } else {
      // Create a new cart for the user
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }],
        totalPrice: product.price * quantity,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart.", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding to cart.", error: error.message });
  }
};

// Get the cart for the logged-in user
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price"
    );  

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart.", error: error.message });
  }
};

// Update item quantity in the cart
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params; 
    const { quantity } = req.body; 

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const item = cart.items.find((item) => item.product.toString() === id);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    // Update total price
    const product = await Product.findById(id);
    cart.totalPrice += (quantity - item.quantity) * product.price;

    // Update item quantity
    item.quantity = quantity;

    await cart.save();
    res.status(200).json({ message: "Cart item updated.", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart item.", error: error.message });
  }
};

// Remove an item from the cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; 

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    // Adjust total price
    const product = await Product.findById(id);
    cart.totalPrice -= cart.items[itemIndex].quantity * product.price;

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    await cart.save();
    res.status(200).json({ message: "Cart item removed.", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing cart item.", error: error.message });
  }
};

// Clear the entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared.", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart.", error: error.message });
  }
};
