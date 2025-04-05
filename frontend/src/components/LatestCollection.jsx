import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  const handleProductClick = (id) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    navigate(`/product/${id}`);
  };

  return (
    <div className="text-center py-8">
      <div className="text-center text-3xl py-8">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-sm sm:text-sm md:text-base text-gray-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Exercitationem, perferendis aut excepturi culpa quas ex, cum
          reiciendis omnis voluptate accusamus voluptatum illum velit ducimus,
          recusandae quo. Eligendi, et reprehenderit! Reprehenderit.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 py-8">
        {latestProducts.map((item, index) => (
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

export default LatestCollection;