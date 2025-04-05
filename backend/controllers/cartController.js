import User from "../models/userModel.js";

// Add product to user's cart
const addToCart = async (req, res) => {
  try {
    // Get the userId from the authenticated token (through middleware)
    const userId = req.user.id; // This assumes `req.user` is set by the auth middleware

    // Check if the user exists
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the item details from the request body
    const { itemId, size } = req.body;
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      // Item exists in cart
      if (cartData[itemId][size]) {
        // Size exists for this item - increment quantity
        cartData[itemId][size] += 1;
      } else {
        // Size doesn't exist for this item - set to 1
        cartData[itemId][size] = 1;
      }
    } else {
      // Item doesn't exist in cart - create new entry
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Save the updated cart to the database
    await User.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ message: "Product added to cart" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update quantity of a cart item
const updateCart = async (req, res) => {
  try {
    // Get the userId from the authenticated token (through middleware)
    const userId = req.user.id; // This assumes `req.user` is set by the auth middleware

    // Check if the user exists
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the item details from the request body
    const { itemId, size, quantity } = req.body;
    let cartData = userData.cartData || {};

    // Check if the item and size exist in the cart
    if (cartData[itemId] && cartData[itemId][size]) {
      if (quantity <= 0) {
        // Remove the size entry if quantity is 0 or less
        delete cartData[itemId][size];
        
        // If no sizes are left for this item, remove the item entirely
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        // Update the quantity
        cartData[itemId][size] = quantity;
      }

      // Save the updated cart to the database
      await User.findByIdAndUpdate(userId, { cartData });
      return res.status(200).json({ message: "Cart updated successfully" });
    }

    return res.status(404).json({ message: "Item not found in cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Get all items in user's cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id; // From token
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cartData: userData.cartData || {} });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export  { addToCart, updateCart, getUserCart };