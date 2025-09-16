import React, { useState, useEffect } from 'react';
import { ChefHat, Star, Clock, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .limit(3);
    
    if (data) {
      setFeaturedProducts(data);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream via-pink-100 to-amber-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-amber-800 leading-tight">
                Baking Happiness,
                <span className="text-pink-600"> One Cake at a Time</span>
              </h1>
              <p className="text-xl text-amber-700 leading-relaxed">
                Indulge in our premium handcrafted cakes made with the finest ingredients. 
                Each cake tells a story of love, passion, and culinary excellence.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  onClick={() => onPageChange('menu')}
                  className="shadow-lg hover:shadow-xl"
                >
                  Order Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => onPageChange('about')}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg"
                alt="Premium Cake"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="font-bold text-amber-800">4.9/5</span>
                  <span className="text-gray-600">(500+ reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-amber-800 mb-12">
            Why Choose PRG The Cake Land?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="text-center p-8">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Expert Bakers</h3>
              <p className="text-gray-600">
                Our skilled artisans have decades of experience creating memorable cakes with traditional techniques and modern innovation.
              </p>
            </Card>

            <Card hover className="text-center p-8">
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Made with Love</h3>
              <p className="text-gray-600">
                Every cake is crafted with premium ingredients and genuine care, ensuring each bite is a moment of pure joy.
              </p>
            </Card>

            <Card hover className="text-center p-8">
              <div className="bg-gradient-to-br from-green-500 to-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Fresh Daily</h3>
              <p className="text-gray-600">
                All our cakes are baked fresh daily using the finest ingredients, ensuring maximum freshness and flavor.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-amber-800 mb-12">
            Featured Delights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} hover className="overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                  <img
                    src={product.image_url || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">
                      ₹{product.price}
                    </span>
                    <Button
                      onClick={() => onPageChange('menu')}
                      variant="outline"
                      size="sm"
                    >
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => onPageChange('menu')}
              className="shadow-lg"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Order Your Perfect Cake?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their special moments. 
            Order online for convenient delivery right to your doorstep.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => onPageChange('menu')}
            className="shadow-lg hover:shadow-xl"
          >
            Start Ordering
          </Button>
        </div>
      </section>
    </div>
  );
};