import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Setup category fallbacks
  const CATEGORY_FALLBACKS = {
    electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    clothing: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    books: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    sports: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop"
  };

  const getFallback = (category) => CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;

  useEffect(() => {
    const fetchWishlist = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get('/products');
        const defaultArray = Array.isArray(data) ? data : (data?.products || []);
        setProducts(defaultArray.filter((p) => wishlist.includes(p.id || p._id)));
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [wishlist]);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4">
        <div className="h-32 w-32 bg-rose-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <Heart className="h-12 w-12 text-rose-200" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-12 text-center max-w-md font-medium text-lg">
          Save items you love to your wishlist and they'll appear here.
        </p>
        <Link
          to="/products"
          className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-orange-500 transition-all shadow-2xl active:scale-95"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-5xl font-black text-gray-900 mb-16 tracking-tight flex items-center gap-6">
        <Heart className="h-12 w-12 text-rose-500 fill-current drop-shadow-lg" />
        My Wishlist
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem]" />
              <div className="h-4 bg-gray-50 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product.id || product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Link to={`/products/${product.id || product._id}`}>
                    <img
                      src={product.images?.[0] || getFallback(product.category)}
                      alt={product.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getFallback(product.category);
                      }}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product.id || product._id)}
                    className="absolute top-5 right-5 p-3.5 bg-rose-500 text-white rounded-full shadow-2xl hover:bg-rose-600 transition-all active:scale-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-8">
                  <h3 className="font-black text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-1 tracking-tight">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{product.price}</span>
                    <button
                      onClick={() => addToCart(product, 1, product.category === 'clothing' ? product.sizes?.[0] : undefined)}
                      className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:scale-[1.03] transition-all active:scale-95 shadow-xl shadow-orange-500/20"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
