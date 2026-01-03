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
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg font-medium"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <div key={item.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">${(item.productPrice || 0).toFixed(2)} each</p>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors font-medium"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors font-medium"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-base sm:text-lg font-semibold">
                      ${((item.productPrice || 0) * (item.quantity || 0)).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 p-2 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-lg sm:text-xl font-semibold">Total: ${(cart.totalAmount || 0).toFixed(2)}</span>
            <button
              onClick={proceedToCheckout}
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 text-base sm:text-lg font-medium transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
