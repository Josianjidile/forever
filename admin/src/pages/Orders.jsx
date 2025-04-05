import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { FiChevronDown } from 'react-icons/fi';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.orders) {
        setOrders(response.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      setUpdatingStatus(orderId);
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Something went wrong while updating status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-500';
      case 'packing':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'out of delivery':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold">No orders found</h3>
        <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h3 className="text-2xl font-bold mb-8 text-gray-800">Your Orders</h3>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg shadow-sm overflow-hidden bg-white">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h4>
                <p className="text-sm text-gray-500">Placed on {formatDate(order.date)}</p>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(order.status)}`}></span>
                <span className="text-sm font-medium capitalize">{order.status}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="p-4 flex items-start hover:bg-gray-50 transition-colors">
                  <img 
                    src={item.image || assets.parcel_icon} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded border mr-4"
                    onError={(e) => {
                      e.target.src = assets.parcel_icon;
                      e.target.onerror = null;
                    }}
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{item.name}</h5>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p><span className="font-medium">Size:</span> {item.size || 'Standard'}</p>
                      <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                      <p><span className="font-medium">Price:</span> {currency}{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{currency}{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <h5 className="font-medium text-gray-800 mb-2">Shipping Address</h5>
              <div className="text-sm text-gray-600">
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country}</p>
                <p>{order.address.zipcode}</p>
                <p className="mt-1">Phone: {order.address.phone}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-3 sm:mb-0">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Items:</span> {order.items.length}</p>
                  <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                  <p className={`${order.payment ? 'text-green-600' : 'text-yellow-600'}`}>
                    <span className="font-medium">Payment:</span> {order.payment ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="text-lg font-semibold">{currency}{order.amount.toFixed(2)}</p>
                </div>
                
                <div className="relative">
                  <select 
                    onChange={(event) => updateStatusHandler(event, order._id)}
                    className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 appearance-none bg-white"
                    defaultValue={order.status}
                    disabled={updatingStatus === order._id}
                  >
                    <option value="Order placed">Order Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out of Delivery">Out of Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FiChevronDown className="h-4 w-4" />
                  </div>
                  {updatingStatus === order._id && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;