import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, X } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const CATEGORY_FALLBACKS = {
    electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    clothing: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    books: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    sports: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop"
  };

  const getFallback = (category) => CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    images: '',
    category: 'electronics',
    brand: '',
    description: '',
    stock: '',
    sizes: '',
    isNewProduct: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/admin/products');
      setProducts(Array.isArray(data) ? data : (data?.products || []));
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        setProducts(prev => prev.filter(p => p._id !== id));
        toast.success('Product deleted');
      } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);
        toast.error('Failed to delete product');
      }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        title: product.title,
        price: product.price,
        images: product.images?.[0] || '',
        category: product.category || 'electronics',
        brand: product.brand || '',
        description: product.description || '',
        stock: product.stock,
        sizes: product.sizes?.join(', ') || '',
        isNewProduct: product.isNewProduct || false
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '', price: '', images: '', category: 'electronics', brand: '', description: '', stock: '', sizes: '', isNewProduct: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: [formData.images],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : []
      };

      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-bold">Loading products...</div>;

  return (
    <div className="p-0 sm:p-2 relative">
      <div className="flex justify-between items-center mb-8 px-2 sm:px-0 mt-4 sm:mt-0">
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 hidden sm:block">Manage Products</h1>
        <button onClick={() => openModal()} className="bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm ml-auto sm:ml-0">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.images?.[0] || getFallback(product.category)} alt={product.title} onError={(e) => { e.target.onerror = null; e.target.src = getFallback(product.category); }} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm" />
                      <div>
                        <p className="font-bold text-gray-900 max-w-[150px] sm:max-w-[300px] truncate">{product.title}</p>
                        <p className="text-xs text-gray-500 font-medium">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{product.price}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                      <button onClick={() => openModal(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 text-gray-400 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5">Name</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5">Brand</label>
                  <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5">Stock</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all transition-all">
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="sports">Sports</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5">Image URL</label>
                <input required value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5">Sizes (comma separated)</label>
                <input value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} placeholder="e.g., S, M, L, XL" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isNew" checked={formData.isNewProduct} onChange={e => setFormData({...formData, isNewProduct: e.target.checked})} className="w-5 h-5 rounded accent-orange-500" />
                <label htmlFor="isNew" className="text-sm font-bold text-gray-900 cursor-pointer">Mark as New Arrival</label>
              </div>

              <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-black mt-6 hover:bg-orange-500 transition-all shadow-md hover:shadow-lg active:scale-95">
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
