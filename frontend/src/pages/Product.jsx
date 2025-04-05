import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { 
  FaStar, 
  FaRegStar, 
  FaHeart, 
  FaRegHeart, 
  FaCheck, 
  FaDollarSign,
  FaExchangeAlt,
  FaMinus,
  FaPlus
} from "react-icons/fa";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, cartData, token, navigate } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image?.[0] || "");
      setSize(product.sizes?.[0] || "");
      // Check if product is in wishlist (you'll need to implement this logic)
      setIsWishlisted(false); // Default to false, implement your wishlist logic
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    if (!size) {
      alert("Please select a size");
      return;
    }
    addToCart(productData._id, size, quantity);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const toggleWishlist = () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    setIsWishlisted(!isWishlisted);
    // Here you would typically call an API to update the wishlist
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Login Required</h3>
            <p className="mb-6">You need to login to add items to your cart or wishlist.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/login')} 
                className="flex-1 bg-black text-white py-2 rounded"
              >
                Login
              </button>
              <button 
                onClick={() => setShowLoginPrompt(false)} 
                className="flex-1 border border-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------Product Data------------ */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ----------Product Images------------ */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData?.image?.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border ${image === item ? 'border-orange-500' : 'border-transparent'}`}
                alt={`Product thumbnail ${index + 1}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%] relative">
            <img className="w-full h-auto" src={image} alt={productData.name} />
            {/* Wishlist button with React Icons */}
            <button 
              onClick={toggleWishlist}
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <FaRegHeart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* ----------Product Info------------ */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <FaStar key={i} className="w-3.5 text-yellow-400" />
            ))}
            <FaRegStar className="w-3.5 text-yellow-400" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* ----------Size Selection------------ */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select size</p>
            <div className="flex gap-2 flex-wrap">
              {productData?.sizes?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors ${
                    item === size ? "border-orange-500 bg-orange-50" : "border-gray-300"
                  }`}
                  aria-label={`Select size ${item}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* ----------Quantity Selector------------ */}
          <div className="flex items-center gap-4 mb-8">
            <p>Quantity:</p>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={() => handleQuantityChange(-1)} 
                className="px-3 py-1 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <FaMinus className="w-3 h-3" />
              </button>
              <span className="px-4">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)} 
                className="px-3 py-1 hover:bg-gray-100"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ----------Add to Cart Button------------ */}
          <button 
            onClick={handleAddToCart} 
            className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          {/* ----------Product Guarantee------------ */}
          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-2">
              <FaCheck className="w-4 h-4 text-green-500" />
              <span>100% original products</span>
            </p>
            <p className="flex items-center gap-2">
              <FaDollarSign className="w-4 h-4 text-green-500" />
              <span>Cash on delivery available</span>
            </p>
            <p className="flex items-center gap-2">
              <FaExchangeAlt className="w-4 h-4 text-green-500" />
              <span>Easy return within 7 days</span>
            </p>
          </div>
        </div>
      </div>

      {/* --------Description and Reviews Section----------- */}
      <div className="mt-20">
        <div className="flex border-b">
          <button className="border-b-2 border-black px-5 py-3 text-sm font-medium">
            Description
          </button>
          <button className="px-5 py-3 text-sm text-gray-500 hover:text-black">
            Reviews (1243)
          </button>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            {productData.longDescription || "Lorem ipsum dolor sit, amet consectetur adipisicing elit. In officia, rerum maxime porro explicabo ipsam esse? Beatae enim tenetur dolorem nam sunt recusandae iure, corrupti cum in corporis ad iusto!"}
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus repellat, eos excepturi quibusdam illo voluptatem
            veniam inventore nisi enim quisquam pariatur a laboriosam explicabo dicta ad debitis ratione. Beatae, nam.
          </p>
        </div>
      </div>
      
      <RelatedProducts category={productData.category} />
    </div>
  ) : (
    <div className="flex justify-center items-center h-64">
      <p>Loading product...</p>
    </div>
  );
};

export default Product;