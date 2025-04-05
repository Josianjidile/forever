import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestseller, setBestseller] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestseller(bestProduct.slice(0, 5));
    }, [products]);

    const handleProductClick = (id) => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        navigate(`/product/${id}`);
    };

    return (
        <div className="my-10">
            <div className="text-center text-3xl py-8">
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className="w-3/4 mx-auto text-sm sm:text-sm md:text-base text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 py-8">
                {bestseller.map((item, index) => (
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

export default BestSeller;