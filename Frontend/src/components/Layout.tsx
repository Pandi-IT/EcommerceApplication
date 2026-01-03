import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
              🛒 Ecommerce
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {user ? (
                user.role === 'SELLER' ? (
                  // Seller Navigation - Only their own products
                  <>
                    <Link
                      to="/seller"
                      className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      My Products
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-pink-600 font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // Buyer Navigation
                  <>
                    <Link
                      to="/products"
                      className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      Products
                    </Link>
                    <Link
                      to="/cart"
                      className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      Cart
                    </Link>
                    <Link
                      to="/orders"
                      className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-pink-600 font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Logout
                    </button>
                  </>
                )
              ) : (
                // Not logged in
                <>
                  <Link
                    to="/products"
                    className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Products
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 px-4 py-2 rounded-full border border-gray-300 hover:border-blue-500"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                {user ? (
                  user.role === 'SELLER' ? (
                    <>
                      <Link
                        to="/seller"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                      >
                        My Products
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium transition-colors text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                      >
                        Products
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                      >
                        Cart
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium transition-colors text-left"
                      >
                        Logout
                      </button>
                    </>
                  )
                ) : (
                  <>
                    <Link
                      to="/products"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                    >
                      Products
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors text-center py-2"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Ecommerce App
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your trusted marketplace for quality products from verified sellers.
                Discover amazing deals and connect with local businesses.
              </p>
              <div className="flex justify-center md:justify-start space-x-4 mt-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">📦</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🚚</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">⭐</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center md:justify-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📞</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Phone</p>
                    <a href="tel:+919751705991" className="text-blue-400 hover:text-blue-300 transition-colors">
                      +91 9751705991
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📧</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Email</p>
                    <a href="mailto:pandiyarajan1204@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                      pandiyarajan1204@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📍</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Location</p>
                    <p className="text-gray-300">Virudhunagar, India-626005</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links & Copyright */}
            <div className="text-center md:text-right">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link to="/products" className="block text-gray-300 hover:text-blue-400 transition-colors">
                  Browse Products
                </Link>
                <Link to="/register" className="block text-gray-300 hover:text-blue-400 transition-colors">
                  Join as Seller
                </Link>
                <Link to="/login" className="block text-gray-300 hover:text-blue-400 transition-colors">
                  Login
                </Link>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  &copy; 2024 Ecommerce App. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Made with ❤️ for amazing shopping experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
