import React, { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import axios from "axios";

const Add = ({ token }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    subCategory: "Topwear",
    bestSeller: false,
    sizes: [],
    images: Array(4).fill(null)
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category options
  const categories = ["Men", "Women", "Kids"];
  const subCategories = {
    Men: ["Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories"],
    Women: ["Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories"],
    Kids: ["Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories"]
  };
  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size) 
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (index, file) => {
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Men",
      subCategory: "Topwear",
      bestSeller: false,
      sizes: [],
      images: Array(4).fill(null)
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.description || !formData.price || formData.sizes.length === 0) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }

    if (!formData.images.some(img => img !== null)) {
      toast.error("Please upload at least one image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subCategory", formData.subCategory);
      formDataToSend.append("sizes", JSON.stringify(formData.sizes));
      formDataToSend.append("bestseller", formData.bestSeller.toString());

      // Append only uploaded images
      formData.images.forEach((img, index) => {
        if (img) formDataToSend.append(`image${index + 1}`, img);
      });

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formDataToSend,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Product added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(error.response.data?.message || "Failed to add product. Please try again.");
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Error setting up request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
<div className="space-y-2">
  <label className="block font-medium text-gray-700">
    Upload Images <span className="text-gray-500">(At least one required)</span>
  </label>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {formData.images.map((img, index) => (
      <label 
        key={index} 
        className="cursor-pointer group relative"
      >
        <div className="relative pb-[100%]"> {/* Square container */}
          <img
            src={img ? URL.createObjectURL(img) : assets.upload_area}
            alt=""
            className="absolute inset-0 w-full h-full object-cover border rounded group-hover:opacity-80 transition-opacity"
          />
          {img && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleImageChange(index, null);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        <input
          onChange={(e) => handleImageChange(index, e.target.files[0])}
          type="file"
          accept="image/*"
          hidden
        />
        <p className="text-xs text-center mt-1 text-gray-500 truncate">
          {img ? img.name : `Image ${index + 1}`}
        </p>
      </label>
    ))}
  </div>
</div>
        {/* Product Info Section */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
              Product Name*
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              required
              placeholder="e.g., Premium Cotton T-Shirt"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1 text-gray-700">
              Product Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              rows={3}
              required
              placeholder="Describe the product features, materials, etc."
            />
          </div>
        </div>

        {/* Category and Price Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block font-medium mb-1 text-gray-700">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subCategory" className="block font-medium mb-1 text-gray-700">
              Subcategory*
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            >
              {subCategories[formData.category]?.map(subCat => (
                <option key={subCat} value={subCat}>{subCat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block font-medium mb-1 text-gray-700">
              Price ($)*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Sizes Section */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Available Sizes*
          </label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  formData.sizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                } transition-colors`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller Checkbox */}
        <div className="flex items-center">
          <input
            id="bestseller"
            name="bestSeller"
            type="checkbox"
            checked={formData.bestSeller}
            onChange={handleInputChange}
            className="h-4 w-4 text-black rounded focus:ring-black border-gray-300"
          />
          <label htmlFor="bestseller" className="ml-2 font-medium text-gray-700">
            Mark as Bestseller
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-black text-white py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Adding...
            </span>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default Add;