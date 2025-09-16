import React from 'react';
import { Award, Users, Heart, Cake } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-amber-800 mb-6">
            About PRG The Cake Land
          </h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto leading-relaxed">
            Founded with a passion for creating extraordinary cakes, PRG The Cake Land has been 
            bringing joy to celebrations across the city. Our commitment to quality, innovation, 
            and customer satisfaction has made us the preferred choice for cake lovers everywhere.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-amber-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                What started as a small family bakery has grown into one of the city's most 
                beloved cake destinations. Our journey began with a simple belief: every 
                celebration deserves a perfect cake.
              </p>
              <p>
                Over the years, we've perfected our recipes, expanded our offerings, and 
                embraced new technologies to serve you better. Yet, our core values remain 
                unchanged - quality ingredients, skilled craftsmanship, and genuine care for 
                every customer.
              </p>
              <p>
                Today, PRG The Cake Land stands as a testament to the power of passion, 
                dedication, and the sweet joy that comes from creating memorable moments 
                for families and friends.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg"
              alt="Our bakery"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-amber-800 mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card hover className="text-center p-6">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Quality Excellence</h3>
              <p className="text-gray-600">
                We use only the finest ingredients and maintain the highest standards in every cake we create.
              </p>
            </Card>

            <Card hover className="text-center p-6">
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Made with Love</h3>
              <p className="text-gray-600">
                Every cake is crafted with genuine care and attention, making each creation special.
              </p>
            </Card>

            <Card hover className="text-center p-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We listen, adapt, and deliver beyond expectations.
              </p>
            </Card>

            <Card hover className="text-center p-6">
              <div className="bg-gradient-to-br from-green-500 to-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly evolve our recipes and techniques to bring you new and exciting flavors.
              </p>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-amber-800 mb-12">
            Meet Our Expert Bakers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">Chef Priya</h3>
              <p className="text-pink-600 font-medium mb-3">Head Baker</p>
              <p className="text-gray-600">
                With 15+ years of experience, Priya leads our team in creating innovative and delicious cakes.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">R</span>
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">Chef Rahul</h3>
              <p className="text-pink-600 font-medium mb-3">Pastry Specialist</p>
              <p className="text-gray-600">
                Rahul specializes in decorative elements and ensures every cake is a work of art.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">G</span>
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">Chef Gauri</h3>
              <p className="text-pink-600 font-medium mb-3">Flavor Expert</p>
              <p className="text-gray-600">
                Gauri develops our unique flavor combinations and maintains our quality standards.
              </p>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Our Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-amber-100 mb-2">10,000+</div>
              <div className="text-amber-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-100 mb-2">50,000+</div>
              <div className="text-amber-200">Cakes Delivered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-100 mb-2">5+</div>
              <div className="text-amber-200">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-100 mb-2">4.9/5</div>
              <div className="text-amber-200">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};