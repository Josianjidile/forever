import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { FaTrash, FaChevronLeft } from 'react-icons/fa';
import CartTotal from '../components/cartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size: size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  if (cartData.length === 0) {
    return (
      <div className="border-t pt-14 px-4 sm:px-8 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <button 
            onClick={() => navigate('/collection')}
            className="bg-black text-white px-6 py-3 rounded-md flex items-center gap-2 mx-auto"
          >
            <FaChevronLeft className="text-sm" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 px-4 sm:px-8 pb-20">
      <div className="text-2xl mb-6">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      
      <div className="space-y-6">
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          return (
            <div 
              key={index} 
              className="py-6 border-b text-gray-700 grid grid-cols-[1fr_auto_auto] gap-4 sm:gap-8 items-center transition-all duration-200 hover:bg-gray-50 px-2 rounded-lg"
            >
              {/* Product Image and Details */}
              <div className="flex items-start gap-4 sm:gap-6">
                <img
                  className="w-16 sm:w-24 h-16 sm:h-24 object-cover rounded-lg"
                  src={productData?.image[0]}
                  alt={productData?.name}
                />
                <div>
                  <p className="text-sm sm:text-lg font-medium text-gray-900">{productData?.name}</p>
                  <div className="flex items-center gap-3 mt-1 sm:mt-2">
                    <p className="text-sm sm:text-base text-gray-600">{currency}{productData?.price}</p>
                    <p className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-200 bg-slate-50 rounded">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1 text-center min-w-[2rem]">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                >
                  +
                </button>
              </div>

              {/* Remove Item Button */}
              <button
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                aria-label="Remove item"
              >
                <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px] bg-gray-50 p-6 rounded-lg'>
          <CartTotal />
          <div className='flex flex-col sm:flex-row justify-between gap-4 mt-8'>
            <button 
              onClick={() => navigate('/collection')}
              className="border border-black text-black px-6 py-3 text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <FaChevronLeft className="text-sm" />
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate("/place-order")} 
              className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 transition-colors"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;