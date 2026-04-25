import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      setUser({ ...data.user, token: data.token });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-12 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-black placeholder-gray-500 shadow-sm";
  const labelClasses = "text-xs font-black text-gray-700 uppercase tracking-widest ml-1 mb-2 block";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl"
      >
        <div className="text-center mb-12">
          <div className="h-20 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-500/30">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Join Shop Mart</h1>
          <p className="text-gray-500 mt-3 font-medium">Create an account to start shopping premium</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className={labelClasses}>Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClasses}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClasses}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 max-md:right-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white h-20 rounded-[2rem] font-black text-xl hover:bg-orange-500 transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group tracking-tight"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-10 text-gray-500 font-bold text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
