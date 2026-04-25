import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useApp();
  const navigate = useNavigate();

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

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty !== undefined ? item.qty : item.quantity) || 0), 0);
  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4">
        <div className="h-32 w-32 bg-gray-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <ShoppingBag className="h-12 w-12 text-gray-300" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 mb-12 text-center max-w-md font-medium text-lg">
          Looks like you haven't added anything to your cart yet. Explore our collection and find something you love!
        </p>
        <Link
          to="/products"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-[1.03] transition-all shadow-2xl shadow-orange-500/30 active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-5xl font-black text-gray-900 mb-16 tracking-tight">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex flex-col sm:flex-row gap-8 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="h-40 w-40 flex-shrink-0 rounded-[2rem] overflow-hidden bg-gray-50 shadow-inner">
                  <img
                    src={item.images?.[0] || getFallback(item.category)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallback(item.category);
                    }}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">{item.brand}</p>
                      <h3 className="font-black text-2xl text-gray-900 mb-3 tracking-tight">{item.title}</h3>
                      {item.selectedSize && (
                        <span className="inline-block px-4 py-1.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <p className="font-black text-2xl text-gray-900 tracking-tighter">₹{item.price}</p>
                  </div>

                  <div className="flex justify-between items-center mt-8">
                    <div className="flex items-center gap-6 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all font-black text-lg"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-black text-lg">{item.qty !== undefined ? item.qty : item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item._id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all font-black text-lg"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-300 hover:text-rose-500 transition-colors p-3"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white p-10 rounded-[3.5rem] sticky top-24 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
            <h2 className="text-3xl font-black mb-10 tracking-tight">Summary</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-white font-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-orange-400 font-black">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span className="text-lg font-medium text-gray-400">Total</span>
                <span className="text-[26px] font-bold text-orange-500">₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white h-20 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-[1.03] active:scale-95"
            >
              Checkout Now
              <ArrowRight className="h-6 w-6" />
            </button>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                Secure encrypted payments
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                30-day money-back guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
