
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from "../../../../assets/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111827] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">

              <span className="text-2xl font-bold tracking-tight">
                <img src={logo} alt="Project Logo" className="h-22 w-auto object-contain" />
              </span>


            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your destination for premium curated goods. We blend timeless style with modern convenience to bring you the best in global e-commerce.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#F59E0B] hover:text-[#111827] transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#F59E0B] hover:text-[#111827] transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#F59E0B] hover:text-[#111827] transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#F59E0B] font-bold uppercase tracking-widest text-xs mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Summer Collection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Discounts</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#F59E0B] font-bold uppercase tracking-widest text-xs mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-[#F59E0B] font-bold uppercase tracking-widest text-xs mb-6">Contact Us</h4>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin size={18} className="text-[#F59E0B] shrink-0" />
              <span>123 Commerce St, Fashion District, NY 10001</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Phone size={18} className="text-[#F59E0B] shrink-0" />
              <span>+1 (555) 000-1234</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Mail size={18} className="text-[#F59E0B] shrink-0" />
              <span>support@haatbazaar.com</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs">
            © 2026 HaatBazaar. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;