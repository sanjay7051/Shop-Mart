import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Package, User as UserIcon, MapPin, Calendar, ShoppingBag, XCircle } from 'lucide-react';
import api from '../services/api';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      setOrders(orders.map(order => 
        (order.id || order._id) === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      toast.error('Failed to cancel order');
      console.error('Error cancelling order:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[300px_1fr_300px] gap-8 items-start">
        {/* Left: Profile Card */}
        <div className="w-full">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
            <div className="h-24 w-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-white">
              <UserIcon className="h-10 w-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}</h2>
            <p className="text-gray-500 font-medium text-sm mt-1 truncate w-full">{user.email}</p>
            <div className="mt-6 inline-block px-5 py-1.5 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/30">
              {user.isAdmin ? 'ADMIN' : 'USER MEMBER'}
            </div>
          </div>
        </div>

        {/* Center: Orders Section */}
        <div className="w-full md:col-span-2 xl:col-span-1 xl:order-none order-last space-y-8">
          <section>
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4 tracking-tight">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
              Order History
            </h2>

            {loading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-16 rounded-2xl border border-gray-100 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Package className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-gray-900 font-black text-xl tracking-tight mb-2">No orders yet</p>
                <p className="text-gray-500 font-medium text-sm mb-8">When you place an order, it will appear here.</p>
                <Link to="/products" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-black text-sm hover:scale-[1.03] transition-all shadow-lg shadow-orange-500/30 active:scale-95">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id || order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order ID</p>
                            <p className="font-black text-gray-900 text-sm">#{(order.id || order._id).slice(-6)}</p>
                          </div>
                          <div className="h-8 w-px bg-gray-200" />
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Date</p>
                            <div className="flex items-center gap-1.5 font-black text-gray-900 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-orange-500" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                            order.status === 'pending' ? "bg-amber-50 text-amber-600 border border-amber-100" : 
                            order.status === 'cancelled' ? "bg-red-50 text-red-600 border border-red-100" : 
                            "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          )}>
                            {order.status}
                          </span>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleCancelOrder(order.id || order._id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-50">
                        <div className="flex flex-wrap gap-3">
                          {order.orderItems.map((item, i) => (
                            <div key={i} className="h-14 w-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative group shadow-sm">
                              <img src={item.image || item.images?.[0]} alt={item.title} className="h-full w-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-[10px]">
                                x{item.quantity}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total</p>
                          <p className="text-xl font-black text-orange-500 tracking-tighter">₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: Account Stats */}
        <div className="w-full">
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-orange-500/20 rounded-full blur-3xl" />
            <h3 className="font-black mb-8 flex items-center gap-3 text-lg tracking-tight">
              <Package className="h-6 w-6 text-orange-400" />
              Account Stats
            </h3>
            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Total Orders</p>
                <p className="text-4xl font-black tracking-tighter text-white">{orders.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Member Since</p>
                <p className="text-xl font-black tracking-tight text-white">April 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
