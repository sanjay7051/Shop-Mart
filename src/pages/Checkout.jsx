import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { toast } from 'sonner';
import { ShieldCheck, CreditCard, Truck, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const isOnlineDisabled = true;
  const { cart, user, clearCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const checkoutItems = location.state?.directBuy ? [location.state.item] : cart;

  const subtotal = checkoutItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty !== undefined ? item.qty : item.quantity) || 0), 0);
  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal + shipping;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone validation: only numbers, max 10 digits
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: cleaned });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleOnlinePayment = async () => {
    try {
      const res = await loadRazorpayScript();

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // Call API to create order
      const { data: orderResponse } = await api.post('/payment/create-order',
        { amount: total },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const options = {
        key: orderResponse.razorpayKeyId, // Provided securely by our backend config
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "Shop Mart",
        description: "Test Transaction",
        order_id: orderResponse.id,
        handler: async function (response) {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
            // Payment verified successfully! Finally place standard order
            placeOrder(true);
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: formData.fullName,
          email: user?.email,
          contact: formData.phone,
        },
        theme: {
          color: "#f97316",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not initiate online payment");
    } finally {
      setLoading(false); // Enable button once modal is closed/handled inside
    }
  };

  const placeOrder = async (isOnline = false) => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || localUser?._id || user?.id || localUser?.id;

    try {
      await api.post('/orders', {
        user: userId,
        orderItems: checkoutItems.map(item => ({ ...item, quantity: item.qty !== undefined ? item.qty : item.quantity, _id: item._id || item.id })),
        shippingAddress: formData,
        totalPrice: Number(total) || 0,
      });
      toast.success('Order placed successfully!');
      if (!location.state?.directBuy) {
        clearCart();
      }
      if (isOnline) {
        setShowSuccessModal(true);
      } else {
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("TOKEN:", localStorage.getItem("token"));

    if (!localStorage.getItem("token")) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    if (paymentMethod === 'online') {
      toast.info("Online payment coming soon 🚧");
      setLoading(false);
      return;
    } else {
      await placeOrder();
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Your cart is empty</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our premium collection and find something you love.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-500 transition-all shadow-lg active:scale-95"
        >
          Go back to products
        </button>
      </div>
    );
  }

  const inputClasses = "w-full px-6 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-black placeholder-gray-500 shadow-sm";
  const labelClasses = "text-xs font-black text-gray-700 uppercase tracking-widest ml-1 mb-2 block";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-900" />
        </button>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-3">
              <Truck className="h-8 w-8 text-orange-500" />
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClasses}>Full Name</label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Phone Number</label>
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Full Address</label>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Street address, Apartment, Suite, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClasses}>City</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="e.g. New York"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Pincode / ZIP</label>
                  <input
                    required
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <div className="pt-10">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-orange-500" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div
                    onClick={() => toast.info("Online payment coming soon 🚧")}
                    className="p-6 border-2 rounded-[2rem] flex items-center justify-between cursor-not-allowed opacity-60"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-sm ${paymentMethod === 'online' ? 'bg-orange-500' : 'bg-gray-200 text-gray-500'
                        }`}>
                        <CreditCard className="h-8 w-8" />
                      </div>
                      <div>
                        <p className={`font-black text-lg ${paymentMethod === 'online' ? 'text-orange-900' : 'text-gray-900'}`}>
                          Credit Card / UPI
                          <span className="text-xs text-orange-500 font-bold ml-2">
                            Coming Soon
                          </span>
                        </p>
                        <p className={`text-sm font-medium ${paymentMethod === 'online' ? 'text-orange-700' : 'text-gray-500'}`}>
                          Online payment coming soon 🚧                        </p>
                      </div>
                    </div>
                    <div className={`h-8 w-8 rounded-full border-4 flex items-center justify-center transition-colors ${paymentMethod === 'online' ? 'border-orange-500 bg-white' : 'border-gray-200'
                      }`}>
                      {paymentMethod === 'online' && <div className="h-3 w-3 rounded-full bg-orange-500" />}
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      toast.info("Online payment coming soon 🚧");
                    }}
                    className={`p-6 border-2 rounded-[2rem] flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-sm ${paymentMethod === 'cod' ? 'bg-orange-500' : 'bg-gray-200 text-gray-500'
                        }`}>
                        <span className="font-bold text-xl ml-1">₹</span>
                      </div>
                      <div>
                        <p className={`font-black text-lg ${paymentMethod === 'cod' ? 'text-orange-900' : 'text-gray-900'}`}>
                          Cash on Delivery
                        </p>
                        <p className={`text-sm font-medium ${paymentMethod === 'cod' ? 'text-orange-700' : 'text-gray-500'}`}>
                          Pay securely when you receive your order
                        </p>
                      </div>
                    </div>
                    <div className={`h-8 w-8 rounded-full border-4 flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-orange-500 bg-white' : 'border-gray-200'
                      }`}>
                      {paymentMethod === 'cod' && <div className="h-3 w-3 rounded-full bg-orange-500" />}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white h-20 rounded-[2rem] font-black text-xl hover:bg-orange-500 transition-all shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-10 tracking-tight"
              >
                {loading ? 'Processing Order...' : `Place Order • ₹${total.toFixed(2)}`}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 sticky top-24 shadow-xl">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Order Summary</h2>
            <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {checkoutItems.map((item) => (
                <div key={item._id} className="flex gap-6">
                  <div className="h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                    <img src={item.images?.[0] || ''} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Qty: {item.qty !== undefined ? item.qty : item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}</p>
                    <p className="font-black text-orange-500 mt-2 text-lg">₹{((Number(item.price) || 0) * (Number(item.qty !== undefined ? item.qty : item.quantity) || 0)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-200">
              <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-emerald-600">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-lg font-medium text-gray-500">Total</span>
                <span className="text-[26px] font-bold text-orange-500">₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-10 p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">
                Secure checkout powered by industry-standard encryption
              </span>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl"
          >
            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              className="text-3xl font-black text-gray-900 mb-4 tracking-tight"
            >
              Payment Verified!
            </motion.h2>
            <p className="text-gray-500 font-medium mb-8">
              Your online payment was successful and your order has been placed securely.
            </p>

            <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left space-y-4 border border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Amount Paid</p>
                <p className="text-2xl font-black text-emerald-600">
                  ₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="h-px bg-gray-200 w-full" />
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Shipping To</p>
                <p className="font-bold text-gray-900">{formData.fullName}</p>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                  {formData.address}, {formData.city} - {formData.pincode}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Ph: +91 {formData.phone}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-emerald-500 text-white h-14 rounded-full font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
            >
              View My Orders
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
