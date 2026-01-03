import React, { useState, useEffect } from 'react';
import { orderAPI, cartAPI } from '../utils/api';

interface OrderItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  orderDate: string;
  items: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      await orderAPI.placeOrder();
      alert('Order placed successfully!');
      await fetchOrders(); // Refresh orders list
      // Optionally clear cart after successful order
      try {
        await cartAPI.clearCart();
      } catch (cartErr) {
        console.warn('Could not clear cart after order:', cartErr);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Make sure you have items in your cart.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
        <button
          onClick={placeOrder}
          disabled={placingOrder}
          className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg font-medium transition-colors"
        >
          {placingOrder ? 'Placing Order...' : 'Place Order from Cart'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">Start shopping to place your first order!</p>
          <a
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg font-medium"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="w-full sm:w-auto flex sm:flex-col items-start sm:items-end gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor('completed')}`}>
                      Completed
                    </span>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-4 sm:px-6 py-4">
                <h4 className="text-base sm:text-md font-semibold text-gray-900 mb-3">Items:</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.productId}-${index}`} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1 w-full">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          ${(item.productPrice || 0).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="font-semibold text-gray-900">
                          ${((item.productPrice || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
