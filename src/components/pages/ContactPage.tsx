import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (you can integrate with your backend)
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-amber-800 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Have questions or special requests? We'd love to hear from you. 
            Get in touch with our friendly team today!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-amber-800 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-600 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 mb-2">Visit Our Store</h3>
                      <p className="text-gray-600">
                        123 Baker Street<br />
                        Sweet District, City - 123456<br />
                        Near Central Mall
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-600 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 mb-2">Call Us</h3>
                      <p className="text-gray-600">
                        <a href="tel:+919876543210" className="hover:text-amber-600">
                          +91 98765 43210
                        </a><br />
                        <a href="tel:+911234567890" className="hover:text-amber-600">
                          +91 12345 67890
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-600 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 mb-2">Email Us</h3>
                      <p className="text-gray-600">
                        <a href="mailto:orders@prgcakeland.com" className="hover:text-amber-600">
                          orders@prgcakeland.com
                        </a><br />
                        <a href="mailto:info@prgcakeland.com" className="hover:text-amber-600">
                          info@prgcakeland.com
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 mb-2">Operating Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p><span className="font-medium">Mon - Sat:</span> 9:00 AM - 9:00 PM</p>
                        <p><span className="font-medium">Sunday:</span> 10:00 AM - 8:00 PM</p>
                        <p className="text-sm text-amber-600 mt-2">
                          *Closed on major holidays
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-amber-800">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button type="submit" className="w-full flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card className="mt-8">
              <CardContent className="p-0">
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Interactive Map Coming Soon</p>
                    <p className="text-sm">123 Baker Street, Sweet District</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};