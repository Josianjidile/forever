import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Add to cart with size validation
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
  
    setCartItems(prev => {
      const newCart = { ...prev };
      if (!newCart[itemId]) {
        newCart[itemId] = {};
      }
      newCart[itemId][size] = (newCart[itemId][size] || 0) + 1;
      return newCart;
    });
  
    toast.success("Added to cart");
  
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`, 
          { itemId, size }, 
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to sync with backend cart:", error);
        toast.error("Could not sync cart with server.");
      }
    }
  };

  // Get user cart from backend
  const getUserCart = async () => {
    if (!token) return;
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`, 
        {}, 
        { headers: { token } }
      );
  
      if (response.data?.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Failed to fetch user cart:", error);
    }
  };

  // Update cart quantity
  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems(prev => {
      const updatedCart = { ...prev };

      if (quantity <= 0) {
        if (updatedCart[itemId]) {
          delete updatedCart[itemId][size];
          if (Object.keys(updatedCart[itemId]).length === 0) {
            delete updatedCart[itemId];
          }
        }
      } else {
        if (!updatedCart[itemId]) {
          updatedCart[itemId] = {};
        }
        updatedCart[itemId][size] = quantity;
      }

      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to update cart on server:", error);
      }
    }
  };

  // Calculate total cart amount
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const product = products.find(p => p._id === itemId);
      if (!product) return total;
      
      return total + Object.entries(sizes).reduce((sum, [size, quantity]) => {
        return sum + (product.price * quantity);
      }, 0);
    }, 0);
  };

  // Get total cart count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, sizes) => {
      return total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
    }, 0);
  };

  // Fetch products
  const getProductsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    getProductsData();
    if (token) {
      getUserCart();
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    navigate,
    updateQuantity,
    getCartAmount,
    getCartCount,
    backendUrl,
    loading,
    token,
    setToken,
    setCartItems,
    getUserCart
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;