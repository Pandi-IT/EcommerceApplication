import React, { useState, useEffect } from 'react';
import { productAPI } from '../utils/api';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  sellerId: number;
  orderCount: number;
}

const SellerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await productAPI.getMyProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', imageUrl: '' });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form data
      const name = formData.name.trim();
      const price = parseFloat(formData.price);

      if (!name) {
        alert('Product name is required');
        setSubmitting(false);
        return;
      }

      if (isNaN(price) || price < 0.01) {
        alert('Price must be a valid number greater than 0.01');
        setSubmitting(false);
        return;
      }

      await productAPI.addProduct({
        name: name,
        price: price,
        description: formData.description?.trim() || '',
        imageUrl: formData.imageUrl?.trim() || ''
      });
      await fetchMyProducts();
      resetForm();
    } catch (err: any) {
      console.error('Error adding product:', err);
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to add product';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSubmitting(true);
    try {
      await productAPI.updateProduct(editingProduct.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || '',
        imageUrl: formData.imageUrl || ''
      });
      await fetchMyProducts();
      resetForm();
    } catch (err: any) {
      console.error('Error updating product:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update product';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productAPI.deleteProduct(productId);
      await fetchMyProducts();
      alert('Product deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete product';
      alert(errorMessage);
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
          onClick={fetchMyProducts}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-b-3xl shadow-xl mb-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Seller Dashboard
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Manage your products and grow your business
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-gray-100 text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ➕ Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-12 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {editingProduct ? '✏️ Edit Product' : '🚀 Add New Product'}
            </h2>
            <p className="text-gray-600">
              {editingProduct ? 'Update your product details' : 'Create a new amazing product listing'}
            </p>
          </div>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0.01"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description"
                />
              </div>
            </div>
            {formData.imageUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="max-w-xs h-48 object-cover rounded-md border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">📦 My Products</h2>
              <p className="text-blue-100 mt-1">{products.length} products in your catalog</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{products.length}</div>
              <div className="text-sm text-blue-100">Total Products</div>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 px-8">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your catalog by adding your first amazing product!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Order Count Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    📦 {product.orderCount || 0} sold
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {product.description || 'No description available'}
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      ✏️ Edit Product
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      🗑️ Delete Product
                    </button>
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

export default SellerDashboard;
