import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Package, ShoppingCart, LayoutDashboard, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const AdminLayout = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  const getPageTitle = () => {
    const currentItem = menu.find(item => location.pathname.includes(item.path));
    return currentItem ? currentItem.name : 'Admin Panel';
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col shadow-lg lg:shadow-none transform transition-transform duration-300 lg:translate-x-0 h-full",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:flex"
      )}>
        <div className="h-16 lg:h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-tighter">
            Admin Panel
          </span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300",
                location.pathname === item.path
                  ? "bg-orange-50 text-orange-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-900 mb-2">
            <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black">
              {user?.name?.[0]?.toUpperCase()}
            </span>
            <div className="truncate flex-1">
              <p>{user?.name}</p>
              <p className="text-xs text-gray-500 font-medium truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl font-bold transition-all duration-300 text-rose-500 hover:bg-rose-50 hover:shadow-sm"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-16 lg:h-20 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight lg:hidden">
              {getPageTitle()}
            </h1>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight hidden lg:block">
              {getPageTitle()}
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-md"
            title="Go to Website"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Back to Website</span>
          </button>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-x-auto overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
