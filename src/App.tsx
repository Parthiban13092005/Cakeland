import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { MenuPage } from './components/pages/MenuPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { CartPage } from './components/pages/CartPage';
import { PaymentPage } from './components/pages/PaymentPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [adminUser, setAdminUser] = useState<any>(null);

  const handleAdminLogin = (admin: any) => {
    setAdminUser(admin);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    // Admin routes
    if (currentPage === 'admin') {
      if (!adminUser) {
        return <AdminLogin onLogin={handleAdminLogin} />;
      }
      return <AdminDashboard />;
    }

    // Payment page (special case with order ID)
    if (currentPage.startsWith('payment-')) {
      const orderId = currentPage.replace('payment-', '');
      return <PaymentPage orderId={orderId} onPageChange={handlePageChange} />;
    }

    // Regular pages
    switch (currentPage) {
      case 'menu':
        return <MenuPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
        return <CartPage onPageChange={handlePageChange} />;
      case 'orders':
        return <OrdersPage onPageChange={handlePageChange} />;
      case 'profile':
        return <ProfilePage />;
      case 'home':
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  // Admin layout
  if (currentPage === 'admin' && adminUser) {
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-r from-rose-pink to-purple-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">PRG Cake Land Admin</h1>
                <p className="text-sm text-pink-100">Welcome, {adminUser.username}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAdminUser(null);
                setCurrentPage('home');
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  // Regular layout
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gradient-to-br from-cream to-blush">
          {currentPage !== 'admin' && (
            <Header currentPage={currentPage} onPageChange={handlePageChange} />
          )}
          
          <main>
            {renderCurrentPage()}
          </main>

          {currentPage !== 'admin' && <Footer />}

          {/* Admin Access Link */}
          {currentPage !== 'admin' && (
            <div className="fixed bottom-4 right-4">
              <button
                onClick={() => setCurrentPage('admin')}
                className="bg-gradient-to-r from-rose-pink to-soft-pink hover:from-pink-600 hover:to-pink-500 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
                title="Admin Access"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;