import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products/new');
        setNewArrivals(Array.isArray(data) ? data : (data?.products || []));
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920"
            alt="Hero"
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
              Elevate Your <span className="text-orange-500">Style</span> with Shop Mart.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed font-medium max-w-xl">
              Discover a curated collection of premium apparel and lifestyle essentials designed for the modern individual.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                to="/products"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-[1.03] transition-all flex items-center gap-3 group shadow-2xl shadow-orange-500/40 active:scale-95"
              >
                Shop Collection
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/products?category=clothing"
                className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all active:scale-95"
              >
                New Arrivals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {[
            { icon: ShoppingBag, title: 'Premium Quality', desc: 'Handpicked premium materials' },
            { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over ₹1000' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
            { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure payment processing' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="h-16 w-16 bg-orange-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <feature.icon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-black text-gray-900 mb-3 text-lg tracking-tight">{feature.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {(loading || newArrivals.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">🔥 New Arrivals</h2>
              <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">Fresh drops just for you</p>
            </div>
            <Link to="/products?new=true" className="text-orange-500 font-black text-sm hover:underline flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* New Arrivals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
            {loading ? (
              [1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />)
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            )}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">Find exactly what you need</p>
          </div>
          <Link to="/products" className="text-orange-500 font-black text-sm hover:underline flex items-center gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Clothing', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800', cat: 'clothing' },
            { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800', cat: 'electronics' },
            { name: 'Books', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800', cat: 'books' },
            { name: 'Sports', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800', cat: 'sports' },
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/products?category=${cat.cat}`}
              className="group relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-3xl font-black text-white tracking-tight">{cat.name}</h3>
                <p className="text-white/70 text-sm font-bold mt-2 uppercase tracking-widest">Explore Collection</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
