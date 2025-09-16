import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-800 text-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">PRG The Cake Land</h3>
            <p className="text-amber-100 mb-4">
              Baking happiness, one cake at a time. Premium quality cakes made with love and the finest ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-100 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-amber-100 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-amber-100" />
                <span className="text-amber-100">
                  123 Baker Street, Sweet District, City - 123456
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-100" />
                <span className="text-amber-100">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-100" />
                <span className="text-amber-100">orders@prgcakeland.com</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Operating Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-100" />
                <div className="text-amber-100">
                  <div>Monday - Saturday</div>
                  <div className="text-sm">9:00 AM - 9:00 PM</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-100" />
                <div className="text-amber-100">
                  <div>Sunday</div>
                  <div className="text-sm">10:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-700 mt-8 pt-8 text-center">
          <p className="text-amber-100">
            &copy; 2025 PRG The Cake Land. All rights reserved. | Made with ❤️ for cake lovers
          </p>
        </div>
      </div>
    </footer>
  );
};