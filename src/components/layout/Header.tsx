import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();
  const { getTotalItems } = useCart();

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavigation = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-cream shadow-lg border-b-2 border-amber-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-800">PRG The Cake Land</h1>
              <p className="text-xs text-amber-600 -mt-1">Premium Bakery</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`text-amber-800 hover:text-amber-600 font-medium transition-colors ${
                  currentPage === item.id ? 'border-b-2 border-amber-600' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {user && (
              <button
                onClick={() => handleNavigation('cart')}
                className="relative p-2 text-amber-800 hover:text-amber-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-300 text-amber-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}

            {/* User Authentication */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6 text-amber-800" />
                  )}
                  <span className="hidden md:block text-amber-800 font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <button
                      onClick={() => {
                        handleNavigation('profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        handleNavigation('orders');
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      My Orders
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={signIn} size="sm">
                Sign in with Google
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-amber-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-amber-200">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`block w-full text-left py-2 px-4 text-amber-800 hover:bg-amber-50 transition-colors ${
                  currentPage === item.id ? 'bg-amber-50 border-l-4 border-amber-600' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};