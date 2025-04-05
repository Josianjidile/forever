import Product from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary';

// Function to add a new product
const addProduct = async (req, res) => {  
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Verify files were uploaded
    if (!req.files) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Process images
    const images = [];
    for (let i = 1; i <= 4; i++) {
      const imageKey = `image${i}`;
      if (req.files[imageKey] && req.files[imageKey][0]) {
        images.push(req.files[imageKey][0]);
      }
    }

    if (images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Upload to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
            // Add timestamp to prevent stale request
            timestamp: Math.round((new Date).getTime()/1000)
          });
          return result.secure_url;
        } catch (uploadError) {
          console.error(`Error uploading image: ${uploadError}`);
          throw uploadError;
        }
      })
    );

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true",
      image: imagesUrl,
      date: Date.now()
    });

    await newProduct.save();

    res.status(201).json({ 
      message: "Product added successfully", 
      product: newProduct 
    });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ 
      message: "Error adding product",
      error: error.message 
    });
  }
};

// Function to list all products
const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Function to remove a product
const removeProduct = async (req, res) => {


  try {
    const product = await Product.findByIdAndDelete(req.body.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing product" });
  }
};

// Function to get a single product by ID
const singleProduct = async (req, res) => {
    try {
      // Option 1: Get ID from URL params (recommended)
    //   const { id } = req.params;
      
      // Option 2: Get ID from query string
      // const { id } = req.query;
      
      // Option 3: Get ID from request body
      const { id } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
      }
  
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ 
        message: "Error fetching product details",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
export { listProducts, removeProduct, singleProduct,addProduct };
