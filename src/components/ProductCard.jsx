import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const CATEGORY_FALLBACKS = {
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
  clothing: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
  books: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
  sports: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
  footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop"
};

const ProductCard = ({ product }) => {
  const { toggleWishlist, wishlist, addToCart, user } = useApp();
  const id = product.id || product._id;
  const imageSrc = product.image || product.images?.[0] || '';
  const fallbackImage = CATEGORY_FALLBACKS[product.category] || CATEGORY_FALLBACKS.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div className="relative rounded-t-2xl overflow-hidden shrink-0">
        <Link to={`/products/${id}`}>
          <img
            src={imageSrc || fallbackImage}
            alt={product.title || product.name}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = fallbackImage;
            }}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </Link>
        {product.isNewProduct && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-1.5 z-10">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse" />
            New
          </div>
        )}
        
        {/* Floating Action Buttons */}
        {!user?.isAdmin && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-2 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 z-10">
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(id); }}
              className={cn(
                "p-2 sm:p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all active:scale-95",
                wishlist.includes(id)
                  ? "bg-rose-500 text-white shadow-rose-500/30"
                  : "bg-white/95 text-gray-600 hover:bg-white hover:text-rose-500"
              )}
            >
              <Heart className={cn("h-4 w-4", wishlist.includes(id) && "fill-current")} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product, 1, product.category === 'clothing' ? product.sizes?.[0] : undefined); }}
              className="p-2 sm:p-2.5 rounded-full bg-white/95 text-gray-600 backdrop-blur-md shadow-lg hover:bg-orange-500 hover:text-white transition-all active:scale-95"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1 mb-1">{product.brand}</p>
        <Link to={`/products/${id}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
            {product.title || product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-end justify-between">
          <span className="text-lg font-bold text-gray-900 leading-none">₹{product.price}</span>
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
            <span className="text-[10px] sm:text-xs font-bold text-amber-600">{product.rating}</span>
            <Star className="h-3 w-3 fill-current" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
