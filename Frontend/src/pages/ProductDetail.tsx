import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  sellerId?: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getProductById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await cartAPI.addToCart(product.id, quantity);
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate('/products')}
          className="group flex items-center text-gray-600 hover:text-blue-600 transition-all duration-300 mb-6"
        >
          <div className="bg-white p-2 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300 mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="font-medium">Back to Products</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden aspect-square relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-500 text-lg">No Image Available</span>
                    </div>
                  </div>
                )}

                {/* Floating badges */}
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ✓ Quality Assured
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    🚚 Free Shipping
                  </span>
                </div>
              </div>

              {/* Additional Images Placeholder */}
              <div className="flex space-x-3 mt-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg border-2 border-white shadow-md"></div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg border-2 border-white shadow-md"></div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg border-2 border-white shadow-md"></div>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  🏷️ New Product
                </span>
                <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(4.8) • 120 reviews</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="line-through text-gray-400">$299.99</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                    Save 25%
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center bg-white border-0 focus:ring-0 font-bold text-lg"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600 font-medium">Available: 50 units</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Adding to Cart...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1-5m1.1 5l1.1 5M9 21h6m-3-3v3" />
                      </svg>
                      <span>Add to Cart</span>
                    </div>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Wishlist</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Product Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Product ID</p>
                    <p className="text-gray-900 font-semibold">#{product.id}</p>
                  </div>
                  {product.sellerId && (
                    <div>
                      <p className="text-gray-600 font-medium">Seller ID</p>
                      <p className="text-gray-900 font-semibold">#{product.sellerId}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 font-medium">Category</p>
                    <p className="text-gray-900 font-semibold">General</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Availability</p>
                    <p className="text-green-600 font-semibold">In Stock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
