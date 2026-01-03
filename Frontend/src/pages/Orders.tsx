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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white rounded-3xl shadow-xl mb-8">
          <div className="px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">📦 My Orders</h1>
                <p className="text-blue-100">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
              </div>
              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 shadow-lg"
              >
                {placingOrder ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>🛒 Place Order from Cart</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

      {orders.length === 0 ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                No Orders Yet
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping and place your first order!
              </p>
              <Link
                to="/products"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🛒 Start Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, orderIndex) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
              style={{ animationDelay: `${orderIndex * 100}ms` }}
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">📦</span>
                      <div>
                        <h3 className="text-xl font-bold">
                          Order #{order.id}
                        </h3>
                        <p className="text-blue-100 text-sm">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto flex sm:flex-col items-start sm:items-end gap-2">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                      ✅ Completed
                    </span>
                    <p className="text-3xl font-bold">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🛍️</span>
                  Order Items ({order.items.length})
                </h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.productId}-${index}`} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 w-full">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">{item.productName}</p>
                              <p className="text-gray-600">
                                ${(item.productPrice || 0).toFixed(2)} × {item.quantity} items
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            ${((item.productPrice || 0) * (item.quantity || 0)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Order Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Orders;
