import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
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
          onClick={fetchProducts}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Discover Amazing Products
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of high-quality products from trusted sellers
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Quality Assured</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Fast Delivery</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-600">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Best Prices</span>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-600 text-lg">We're working on adding amazing products for you!</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-sm opacity-90">Products</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white text-center">
              <div className="text-2xl font-bold">
                {products.filter(p => p.imageUrl).length}
              </div>
              <div className="text-sm opacity-90">With Images</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center">
              <div className="text-2xl font-bold">
                ${Math.min(...products.map(p => typeof p.price === 'number' ? p.price : 0)).toFixed(2)}
              </div>
              <div className="text-sm opacity-90">Lowest Price</div>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 text-white text-center">
              <div className="text-2xl font-bold">
                ${Math.max(...products.map(p => typeof p.price === 'number' ? p.price : 0)).toFixed(2)}
              </div>
              <div className="text-sm opacity-90">Highest Price</div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative w-full h-56 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* View Details Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      View Details →
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </p>
                      <p className="text-xs text-green-600 font-medium mt-1">Free Shipping</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
