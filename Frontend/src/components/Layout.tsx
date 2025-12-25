import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Ecommerce
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              {/* Products link for everyone */}
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Products
              </Link>

              {user ? (
                user.role === 'SELLER' ? (
                  // Seller Navigation
                  <>
                    <Link
                      to="/seller"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      My Products
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // Buyer Navigation
                  <>
                    <Link
                      to="/cart"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Cart
                    </Link>
                    <Link
                      to="/orders"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
                    >
                      Logout
                    </button>
                  </>
                )
              ) : (
                // Not logged in
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Ecommerce App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
