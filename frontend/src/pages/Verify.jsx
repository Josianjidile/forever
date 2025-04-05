import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const VerifyPayment = () => {
  const {
    backendUrl,
    token,
    setCartItems,
  } = useContext(ShopContext);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = React.useState(true);
  
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      setIsVerifying(true);
      
      if (!token) {
        toast.error('Please login to verify payment');
        return navigate('/login');
      }

      if (!orderId) {
        toast.error('Invalid order reference');
        return navigate('/');
      }

      const response = await axios.post(
        `${backendUrl}/api/order/verifystripe`, 
        { success, orderId }, 
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Payment verified successfully!');
        setCartItems({});
        navigate('/orders');
      } else {
        toast.error(response.data.message || 'Payment verification failed');
        navigate('/cart');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || error.message || 'Payment verification error');
      navigate('/cart');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        {isVerifying ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">Verifying your payment...</h2>
            <p className="text-gray-600 mt-2">Please wait while we confirm your transaction</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Verification Complete</h2>
            <p className="text-gray-600 mt-2">You will be redirected shortly</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;