import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PackageX } from 'lucide-react';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const isNew = searchParams.get('new') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', {
          params: { category, search, new: isNew },
        });
        setProducts(Array.isArray(data) ? data : (data?.products || []));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, isNew]);

  const categories = ['electronics', 'clothing', 'books', 'sports'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Scrollable Category Filters */}
      <div className="sticky top-16 bg-white z-30 pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 md:mb-8 border-b border-gray-100 sm:border-none shadow-sm sm:shadow-none">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 sm:flex-wrap sm:justify-center">
          <button
            onClick={() => setSearchParams({})}
            className={cn(
              "min-w-max px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-2",
              !category && !isNew
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20 md:scale-105" 
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            )}
          >
            All Products
          </button>
          <button
            onClick={() => setSearchParams({ new: 'true' })}
            className={cn(
              "min-w-max px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm",
              isNew === 'true'
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20 md:scale-105" 
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            )}
          >
            🔥 New Arrivals
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchParams({ category: cat })}
              className={cn(
                "min-w-max px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm capitalize",
                category === cat 
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20 md:scale-105" 
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">
          {isNew === 'true' ? 'New Arrivals' : category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Our Collection'}
          <span className="text-sm font-bold text-gray-400 ml-3 uppercase tracking-widest hidden sm:inline-block">({products.length} Items)</span>
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
          <PackageX className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-black text-gray-900 mb-2">No products found</h3>
          <p className="text-sm font-medium text-gray-500 max-w-sm">
            We couldn't find any products matching your search criteria.
          </p>
          <button 
            onClick={() => setSearchParams({})}
            className="mt-6 bg-white border border-gray-200 text-gray-900 px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
export default Products;
