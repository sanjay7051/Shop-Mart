import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, ChevronRight, ShieldCheck, Truck, RotateCcw, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [flyingImages, setFlyingImages] = useState([]);
  const sizeSectionRef = React.useRef(null);
  const { addToCart, toggleWishlist, wishlist, user } = useApp();

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        // Do not auto-select size to force user selection
        // if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);

        const { data: similar } = await api.get('/products', {
          params: { category: data.category },
        });
        setSimilarProducts(Array.isArray(similar) ? similar.filter((p) => (p.id || p._id) !== id).slice(0, 10) : []);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0) {
      if (!selectedSize) {
        setSizeError(true);
        toast.error("Please select a size");
        sizeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    setSizeError(false);
    
    // Flying Image Animation Logic
    const imgEl = document.getElementById('main-product-image');
    const cartEl = document.getElementById('navbar-cart-icon');

    if (imgEl && cartEl) {
      const imgRect = imgEl.getBoundingClientRect();
      const cartRect = cartEl.getBoundingClientRect();
      
      const newId = Date.now();
      const flyingImg = {
        id: newId,
        src: product.images?.[0] || '',
        startX: imgRect.left,
        startY: imgRect.top,
        width: imgRect.width,
        height: imgRect.height,
        targetX: cartRect.left + cartRect.width / 2 - 10,
        targetY: cartRect.top + cartRect.height / 2 - 10,
      };

      setFlyingImages((prev) => [...prev, flyingImg]);

      setTimeout(() => {
        setFlyingImages((prev) => prev.filter((img) => img.id !== newId));
      }, 800);
    }
    
    addToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0) {
      if (!selectedSize) {
        setSizeError(true);
        toast.error("Please select a size");
        sizeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    setSizeError(false);
    
    const singleItem = {
      ...product,
      quantity: quantity,
      selectedSize
    };

    navigate('/checkout', { state: { directBuy: true, item: singleItem } });
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Premium Experience...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-black text-gray-900">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 md:gap-3 text-xs font-black uppercase tracking-widest text-gray-400 mb-6 md:mb-8">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-orange-500 transition-colors">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 truncate max-w-[150px] md:max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="aspect-square sm:aspect-[4/5] lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xl relative">
            <img
              id="main-product-image"
              src={product.images?.[0] || getFallback(product.category)}
              alt={product.title}
              loading="eager"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getFallback(product.category);
              }}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-2 md:mb-4">{product.brand}</p>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">{product.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4 md:h-5 md:w-5 fill-current", i >= Math.floor(product.rating) && "text-gray-200")} />
                ))}
                <span className="ml-2 text-xs md:text-sm font-black text-gray-900 tracking-tight">{product.rating} / 5.0</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-widest">In Stock ({product.stock})</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter">₹{product.price}</span>
          </div>

          <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-8">{product.description}</p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8" ref={sizeSectionRef}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-widest">Select Size</h3>
                {sizeError && <span className="text-[10px] md:text-xs font-bold text-red-500 animate-pulse">Required</span>}
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={cn(
                      "h-10 w-10 md:h-12 md:w-12 rounded-xl border-2 font-black transition-all flex items-center justify-center text-xs md:text-sm",
                      selectedSize === size
                        ? "border-orange-500 bg-orange-50 text-orange-500 shadow-md shadow-orange-500/10 scale-105"
                        : sizeError
                        ? "border-red-300 text-red-400 hover:border-red-400"
                        : "border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Quantity</h3>
            <div className="flex items-center gap-4 bg-gray-50 w-fit p-1 rounded-xl border border-gray-100">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all font-black text-base"
              >
                -
              </button>
              <span className="w-8 text-center font-black text-sm md:text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all font-black text-base"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          {!user?.isAdmin && (
            <div className="flex gap-3 mt-4 mb-10">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 hidden sm:block" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 h-12 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product.id || product._id)}
                className={cn(
                  "h-12 w-12 rounded-xl shrink-0 flex items-center justify-center transition-all border active:scale-95 shadow-sm hover:shadow-md",
                  wishlist.includes(product.id || product._id)
                    ? "bg-rose-50 border-rose-200 text-rose-500"
                    : "bg-white border-gray-200 text-gray-500 hover:text-gray-900"
                )}
              >
                <Heart className={cn("h-5 w-5", wishlist.includes(product.id || product._id) && "fill-current")} />
              </button>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
            {[
              { icon: Truck, text: 'Free Shipping' },
              { icon: RotateCcw, text: '30 Day Returns' },
              { icon: ShieldCheck, text: 'Secure Checkout' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <badge.icon className="h-5 w-5 text-gray-300" />
                <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-wider leading-tight">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-4 border-t border-gray-100 pt-8 mt-8">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Share:</span>
            <button 
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              title="Share on Facebook"
            >
              <Facebook className="h-4 w-4" />
            </button>
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${product.title} on Shop Mart!`)}`, '_blank')}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all shadow-sm"
              title="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
              title="Copy Link"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {similarProducts.length > 0 && (
        <section className="mt-32">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Related Products</h2>
            <Link to={`/products?category=${product.category}`} className="text-orange-500 font-black text-sm hover:underline">View All</Link>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory custom-scrollbar">
            {similarProducts.map((p) => (
              <Link
                key={p.id || p._id}
                to={`/products/${p.id || p._id}`}
                className="group block bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={p.images?.[0] || getFallback(p.category)}
                    alt={p.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallback(p.category);
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {p.isNewProduct && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      New
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">{p.brand}</p>
                  <h3 className="font-black text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1 tracking-tight">{p.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{p.price}</p>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-bold">{p.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* Flying Images */}
      {flyingImages.map((img) => (
        <motion.img
          key={img.id}
          src={img.src}
          initial={{
            position: 'fixed',
            top: img.startY,
            left: img.startX,
            width: img.width,
            height: img.height,
            zIndex: 9999,
            borderRadius: '3rem',
            opacity: 0.8,
          }}
          animate={{
            top: img.targetY,
            left: img.targetX,
            width: 20,
            height: 20,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="object-cover pointer-events-none shadow-2xl"
          referrerPolicy="no-referrer"
        />
      ))}
    </div>
  );
};

export default ProductDetails;
