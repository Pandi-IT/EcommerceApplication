import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import SellerDashboard from './pages/SellerDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Buyer Route Component (for regular users)
const BuyerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is a seller, redirect to seller dashboard
  if (user.role === 'SELLER') {
    return <Navigate to="/seller" />;
  }

  return children;
};

// Seller Route Component (for sellers only)
const SellerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is not a seller, redirect to products
  if (user.role !== 'SELLER') {
    return <Navigate to="/products" />;
  }

  return children;
};

// Block sellers from accessing buyer routes
const BlockSellerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is a seller, redirect to seller dashboard
  if (user && user.role === 'SELLER') {
    return <Navigate to="/seller" replace />;
  }

  return children;
};

// Home Page Component
const Home = () => {
  const { user } = useAuth();

  if (user) {
    if (user.role === 'SELLER') {
      return (
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome Seller!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your products and grow your business
          </p>
          <a
            href="/seller"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg font-medium"
          >
            Manage Products
          </a>
        </div>
      );
    } else {
      return (
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome Back!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing products from our sellers
          </p>
          <a
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg font-medium"
          >
            Browse Products
          </a>
        </div>
      );
    }
  }

  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Ecommerce App
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Discover amazing products from our sellers
      </p>
      <a
        href="/products"
        className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg font-medium"
      >
        Browse Products
      </a>
    </div>
  );
};

// App Content Component (needs to be inside AuthProvider)
const AppContent = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/products" 
          element={
            <BlockSellerRoute>
              <Products />
            </BlockSellerRoute>
          } 
        />
        <Route 
          path="/products/:id" 
          element={
            <BlockSellerRoute>
              <ProductDetail />
            </BlockSellerRoute>
          } 
        />
        <Route
          path="/cart"
          element={
            <BuyerRoute>
              <Cart />
            </BuyerRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <BuyerRoute>
              <Orders />
            </BuyerRoute>
          }
        />
        <Route
          path="/seller"
          element={
            <SellerRoute>
              <SellerDashboard />
            </SellerRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
