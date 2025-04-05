import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      setOrderData(response.data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "delivered":
        return "bg-green-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
      case "out of delivery":
        return "bg-purple-500";
      case "cancelled":
        return "bg-red-500";
      case "packing":
        return "bg-yellow-500";
      case "order placed":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusTextColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "delivered":
        return "text-green-600";
      case "processing":
        return "text-blue-600";
      case "shipped":
      case "out of delivery":
        return "text-purple-600";
      case "cancelled":
        return "text-red-600";
      case "packing":
        return "text-yellow-600";
      case "order placed":
        return "text-gray-600";
      default:
        return "text-gray-500";
    }
  };

  if (loading && !orderData.length) {
    return (
      <div className="border-t pt-16 px-4 sm:px-8 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t pt-16 px-4 sm:px-8 min-h-[50vh] flex items-center justify-center">
        <div className="text-center p-4 max-w-md mx-auto bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadOrderData}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!orderData.length) {
    return (
      <div className="border-t pt-16 px-4 sm:px-8 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-700">No orders found</h3>
          <p className="text-gray-500 mt-2">
            You haven't placed any orders yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <Title text1={"MY"} text2={"ORDERS"} />
        <p className="mt-2 text-gray-600">
          Review your order history and status
        </p>
      </div>

      <div className="space-y-8">
        {orderData.map((order, orderIndex) => (
          <div
            key={orderIndex}
            className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center">
                  <span
                    className={`${getStatusColor(
                      order.status
                    )} w-3 h-3 rounded-full`}
                  ></span>
                  <span className={`ml-2 text-sm font-medium capitalize ${getStatusTextColor(order.status)}`}>
                    {order.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="divide-y">
              {order.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border"
                      src={item.image[0]}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100";
                        e.target.onerror = null;
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900 hover:text-gray-600 transition-colors">
                          {item.name}
                        </p>
                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                          <p>Size: {item.size || "Standard"}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {currency}{item.price.toFixed(2)}</p>
                          <p>Payment: {order.paymentMethod || "Not specified"}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start gap-3">
                        <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                          Track Package
                        </button>
                        <Link
                          to="/collection"
                          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          Buy Again
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Total</p>
                <p className="text-lg font-semibold">
                  {currency}
                  {order.items
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;