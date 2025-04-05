import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useNavigate } from "react-router-dom";

const RelatedProducts = ({ category, SubCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => SubCategory === item.SubCategory);
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, SubCategory]);

  const handleProductClick = (id) => {
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Optional: adds smooth scrolling animation
    });
    // Navigate to the product page
    navigate(`/product/${id}`);
  };

  return (
    <div className="text-center py-8">
      <Title text1={"RELATED"} text2={"PRODUCTS"} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 py-8">
        {related.map((item, index) => (
          <div 
            key={index} 
            onClick={() => handleProductClick(item._id)}
            className="cursor-pointer"
          >
            <ProductItem 
              id={item._id} 
              image={item.image} 
              name={item.name} 
              price={item.price} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;