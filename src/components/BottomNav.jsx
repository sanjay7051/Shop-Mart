import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, Package, ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';

const BottomNav = () => {
  const { user } = useApp();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, hideForAdmin: true },
    { 
      name: user?.isAdmin ? 'Dashboard' : 'Profile', 
      path: user?.isAdmin ? '/admin/dashboard' : '/profile', 
      icon: user?.isAdmin ? LayoutDashboard : User 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 lg:hidden pb-safe border-t border-gray-100">
      <div className="flex justify-around items-center h-16">
        {navItems.filter(item => !(item.hideForAdmin && user?.isAdmin)).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300",
                isActive ? "text-orange-500" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "fill-orange-50 stroke-orange-500" : "")} />
              <span className={cn("text-[10px] font-bold", isActive ? "text-orange-500" : "text-gray-500")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
