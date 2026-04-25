import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* About */}
          <div className="space-y-8">
            <Link to="/" className="text-4xl font-black tracking-tighter">
              Shop Mart<span className="text-orange-500">.</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Redefining premium e-commerce with a focus on quality, sustainability, and modern design. Join our community of style enthusiasts.
            </p>
            <div className="flex gap-5">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-90">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-gray-500">Shop Categories</h4>
            <ul className="space-y-5 text-gray-400 text-sm font-bold">
              {['Clothing', 'Electronics', 'Books', 'Sports', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link to={`/products?category=${item.toLowerCase()}`} className="hover:text-orange-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-gray-500">Customer Care</h4>
            <ul className="space-y-5 text-gray-400 text-sm font-bold">
              <li><Link to="/track-order" className="hover:text-orange-400 transition-colors">Track Order</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-orange-400 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-orange-400 transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faqs" className="hover:text-orange-400 transition-colors">FAQs</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-gray-500">Get in Touch</h4>
            <ul className="space-y-6 text-gray-400 text-sm font-bold">
              <li className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-500">
                  <Mail className="h-5 w-5" />
                </div>
                <span>support@shopmart.com</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-500">
                  <Phone className="h-5 w-5" />
                </div>
                <span>+1 (555) SHOP-001</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="leading-tight">123 Market Ave, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
          <p>© 2026 Shop Mart. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
