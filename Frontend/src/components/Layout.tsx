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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              🛒 Ecommerce
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {user ? (
                user.role === 'SELLER' ? (
                  // Seller Navigation - Only their own products
                  <>
                    <Link
                      to="/seller"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      My Products
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // Buyer Navigation
                  <>
                    <Link
                      to="/products"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Products
                    </Link>
                    <Link
                      to="/cart"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative"
                    >
                      Cart
                    </Link>
                    <Link
                      to="/orders"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium transition-colors"
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
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Products
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors"
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
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-500 text-sm sm:text-base">
            <p>&copy; 2024 Ecommerce App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
