import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { user, cart, wishlist, logout } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-tighter">
              Shop Mart
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm text-black placeholder-gray-500"
              />
            </div>
          </form>

          {/* Nav Links */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/" className="text-gray-600 hover:text-orange-500 font-semibold text-sm hidden sm:block">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-orange-500 font-semibold text-sm hidden sm:block">
              Products
            </Link>

            {user?.isAdmin && (
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-orange-500 font-semibold text-sm hidden sm:block border border-gray-200 px-3 py-1 rounded-full shadow-sm bg-gray-50">
                Dashboard
              </Link>
            )}
            
            {!user?.isAdmin && (
              <>
                <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link id="navbar-cart-icon" to="/cart" className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.reduce((acc, item) => acc + (item.qty !== undefined ? item.qty : item.quantity || 0), 0) > 0 && (
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {cart.reduce((acc, item) => acc + (item.qty !== undefined ? item.qty : item.quantity || 0), 0)}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={logout} className="p-2 text-gray-600 hover:text-rose-600 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:scale-[1.03] transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
