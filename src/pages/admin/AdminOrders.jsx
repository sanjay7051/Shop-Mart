import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/orders/${id}`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      // Optimistic update
      const previousOrders = [...orders];
      setOrders(orders.filter(order => order._id !== id));
      
      try {
        await api.delete(`/admin/orders/${id}`);
        toast.success('Order deleted successfully');
      } catch (error) {
        setOrders(previousOrders);
        console.error("DELETE ORDER ERROR:", error);
        toast.error('Failed to delete order');
      }
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) return <div className="p-8 text-gray-500 font-bold">Loading orders...</div>;

  return (
    <div className="p-0 sm:p-2">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-gray-500">{order._id.substring(order._id.length - 6)}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{order.user?.name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500 font-medium">{order.user?.email || 'No email provided'}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`font-bold text-xs uppercase px-3 py-1.5 rounded-full outline-none cursor-pointer ${statusColors[order.status] || 'bg-gray-100 text-gray-600'} transition-all`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(order._id)}
                      title="Delete Order"
                      className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors inline-flex justify-center items-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-bold">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
