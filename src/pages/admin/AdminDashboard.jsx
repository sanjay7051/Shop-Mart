import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-gray-500 font-bold">Loading dashboard...</div>;

  const statCards = [
    { name: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Total Users', value: stats.users, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-0 sm:p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-6">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${stat.bg} shadow-sm`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
