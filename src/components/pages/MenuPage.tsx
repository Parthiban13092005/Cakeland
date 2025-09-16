import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types';

export const MenuPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const { user, signIn } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('name');
    
    if (data && !error) {
      setProducts(data);
      const initialQuantities: { [key: string]: number } = {};
      data.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    }
    setLoading(false);
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      signIn();
      return;
    }
    
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    
    // Show success message (you can implement a toast notification here)
    alert(`Added ${product.name} (${quantity}) to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-amber-800 mb-4">
            Our Delicious Menu
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Explore our premium collection of handcrafted cakes, each made with love and the finest ingredients.
          </p>
        </div>

        {/* Authentication Notice */}
        {!user && (
          <div className="bg-amber-100 border border-amber-400 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-amber-800">
                <h3 className="font-bold text-lg">Sign in to Order</h3>
                <p>Please sign in with Google to add items to your cart and place orders.</p>
              </div>
              <Button onClick={signIn} variant="primary">
                Sign in with Google
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} hover className="overflow-hidden">
              <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                <img
                  src={product.image_url || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-amber-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold text-pink-600">
                    ₹{product.price.toFixed(2)}
                  </span>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                      disabled={quantities[product.id] <= 1}
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-800">
                      {quantities[product.id] || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full flex items-center justify-center space-x-2"
                  disabled={!user}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">
              No products available
            </h3>
            <p className="text-gray-600">
              Please check back later for our delicious cake offerings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};