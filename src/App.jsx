import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

import TrackOrder from './pages/TrackOrder';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

const ProtectedRoute = ({ children }) => {
  if (!localStorage.getItem('token')) return <Navigate to="/login" />;
  return children;
};

const UserRoute = ({ children }) => {
  const { user } = useApp();
  if (user?.isAdmin) return <Navigate to="/" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useApp();
  if (!localStorage.getItem('token') || !user?.isAdmin) return <Navigate to="/admin/login" />;
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans mb-16 lg:mb-0">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
          <Route path="/wishlist" element={<UserRoute><Wishlist /></UserRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/returns" element={<ReturnPolicy />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/checkout" element={<ProtectedRoute><UserRoute><Checkout /></UserRoute></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BottomNav />}
      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
