import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../utils/api';

interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

interface Cart {
  userId: number;
  items: CartItem[];
  totalAmount: number;
}

const Cart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(cartItemId);
      return;
    }

    try {
      await cartAPI.updateCartItem(cartItemId, newQuantity);
      await fetchCart(); // Refresh cart
    } catch (err) {
      console.error('Error updating cart item:', err);
      alert('Failed to update item quantity');
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      await fetchCart(); // Refresh cart
    } catch (err) {
      console.error('Error removing cart item:', err);
      alert('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clearCart();
        await fetchCart(); // Refresh cart
      } catch (err) {
        console.error('Error clearing cart:', err);
        alert('Failed to clear cart');
      }
    }
  };

  const proceedToCheckout = async () => {
    // This will be implemented when we create the order functionality
    alert('please place the order in the orders page');
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
          onClick={fetchCart}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping now!
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl shadow-xl mb-8">
          <div className="px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">🛒 Your Shopping Cart</h1>
                <p className="text-blue-100">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
              </div>
              <button
                onClick={clearCart}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold shadow-lg"
              >
                🗑️ Clear Cart
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Product Image Placeholder */}
                    <div className="w-full sm:w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📦</span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 w-full">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.productName}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        ${(item.productPrice || 0).toFixed(2)} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            ${((item.productPrice || 0) * (item.quantity || 0)).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 font-semibold transition-colors text-sm"
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Cart Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                  <span className="font-semibold">${(cart.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${(cart.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 Proceed to Checkout
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Secure checkout powered by our platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
