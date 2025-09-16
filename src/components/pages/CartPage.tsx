import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, Calendar, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface CartPageProps {
  onPageChange: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onPageChange }) => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalAmount } = useCart();
  const { user } = useAuth();
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    pincode: '',
    deliveryDate: '',
    deliveryTime: '',
    cakeMessage: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setOrderData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;

    setLoading(true);
    try {
      // Get tomorrow's date as minimum delivery date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const selectedDate = new Date(orderData.deliveryDate);
      
      if (selectedDate < tomorrow) {
        alert('Please select a delivery date at least one day in advance.');
        setLoading(false);
        return;
      }

      const totalAmount = getTotalAmount();
      const loyaltyPoints = Math.floor(totalAmount / 10);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: items,
          total_amount: totalAmount,
          delivery_address: orderData.deliveryAddress,
          delivery_date: orderData.deliveryDate,
          delivery_time: orderData.deliveryTime,
          cake_message: orderData.cakeMessage,
          status: 'pending_payment'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Update user's loyalty points
      const { error: pointsError } = await supabase
        .from('users')
        .update({ 
          loyalty_points: user.loyalty_points + loyaltyPoints 
        })
        .eq('id', user.id);

      if (pointsError) console.warn('Failed to update loyalty points:', pointsError);

      // Clear cart
      clearCart();
      
      // Redirect to payment page with order ID
      onPageChange(`payment-${order.id}`);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            Please Sign In
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You need to be signed in to view your cart and place orders.
          </p>
          <Button onClick={() => onPageChange('home')}>
            Go Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Looks like you haven't added any delicious cakes to your cart yet.
          </p>
          <Button onClick={() => onPageChange('menu')} size="lg">
            Browse Our Menu
          </Button>
        </div>
      </div>
    );
  }

  const totalAmount = getTotalAmount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-amber-800 mb-8 text-center">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-amber-800">Your Items</h2>
                  <Button variant="ghost" onClick={clearCart} size="sm">
                    Clear Cart
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.product.image_url || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-amber-800">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm">{item.product.description}</p>
                        <p className="text-pink-600 font-bold">₹{item.product.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-md hover:bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-800">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-800 mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Checkout */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-xl font-bold text-amber-800">Order Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-pink-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-amber-600 mt-2">
                    You'll earn {Math.floor(totalAmount / 10)} loyalty points!
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Details */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-amber-800">Delivery Details</h3>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={orderData.deliveryAddress}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter complete delivery address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={orderData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={orderData.deliveryDate}
                      onChange={handleInputChange}
                      required
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Delivery Time *
                    </label>
                    <select
                      name="deliveryTime"
                      value={orderData.deliveryTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select time slot</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                      <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                      <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                      <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cake Message (Optional)
                    </label>
                    <input
                      type="text"
                      name="cakeMessage"
                      value={orderData.cakeMessage}
                      onChange={handleInputChange}
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Happy Birthday! (max 100 characters)"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {orderData.cakeMessage.length}/100 characters
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full"
                    disabled={!orderData.deliveryAddress || !orderData.pincode || !orderData.deliveryDate || !orderData.deliveryTime || loading}
                    loading={loading}
                  >
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};