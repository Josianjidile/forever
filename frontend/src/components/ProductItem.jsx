import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link to={`/product/${id}`} className="text-gray-600 cursor-pointer">
            <div className="overflow-hidden">
                <img
                    className="hover:scale-110 transition ease-in-out duration-300"
                    src={image?.[0] || 'https://via.placeholder.com/150'} // Fallback image
                    alt={name} // Descriptive alt text
                />
            </div>
            <p className="pt-3 pb-1 text-sm">{name}</p>
            <p className="text-sm font-medium">
                {currency}
                {typeof price === 'number' ? price.toFixed(2) : price} {/* Format price */}
            </p>
        </Link>
    );
};

export default ProductItem;