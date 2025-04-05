import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
      toast.error("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800">Product List</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Bestseller</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    {product.image?.[0] && (
                      <img 
                        src={product.image[0]} 
                        alt={product.name}
                        className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="sm:hidden text-xs text-gray-500">${product.price}</div>
                    <div className="md:hidden text-xs text-gray-500 mt-1">
                      {product.sizes?.slice(0, 2).map(size => (
                        <span key={size} className="mr-1 px-1 py-0.5 text-xs rounded bg-gray-100 text-gray-800">{size}</span>
                      ))}
                      {product.sizes?.length > 2 && <span className="text-xs">+{product.sizes.length - 2}</span>}
                    </div>
                    <div className="lg:hidden text-xs mt-1">
                      {product.bestseller ? (
                        <span className="px-1 py-0.5 text-xs rounded bg-green-100 text-green-800">Bestseller</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{product.price}</div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {product.sizes?.map((size) => (
                        <span key={size} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap">
                    {product.bestseller ? (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Yes</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default List;