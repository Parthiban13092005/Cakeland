import React, { useEffect, useState } from 'react';
import { CreditCard, Copy, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Order } from '../../types';

interface PaymentPageProps {
  orderId: string;
  onPageChange: (page: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ orderId, onPageChange }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const generatePaymentReference = () => {
    return `PRG${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const handleVerifyPayment = async () => {
    if (!order) return;
    
    setPaymentVerifying(true);
    try {
      const paymentRef = generatePaymentReference();
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_reference: paymentRef,
          status: 'pending_verification'
        })
        .eq('id', orderId);
      
      if (error) throw error;
      
      alert('Payment verification request submitted! We will verify your payment and update the order status shortly.');
      onPageChange('orders');
      
    } catch (error) {
      console.error('Error submitting payment verification:', error);
      alert('Failed to submit payment verification. Please try again.');
    } finally {
      setPaymentVerifying(false);
    }
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

  if (!order || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            Order Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => onPageChange('home')}>
            Go Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            Payment Instructions
          </h1>
          <p className="text-xl text-amber-700">
            Complete your payment using any of the methods below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-amber-800">Order Summary</h2>
              <p className="text-gray-600">Order ID: {order.id.substring(0, 8).toUpperCase()}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-pink-600 text-2xl">₹{order.total_amount.toFixed(2)}</span>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg mt-4">
                  <h3 className="font-bold text-amber-800 mb-2">Delivery Details</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Address:</strong> {order.delivery_address}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Date:</strong> {order.delivery_date}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Time:</strong> {order.delivery_time}
                  </p>
                  {order.cake_message && (
                    <p className="text-sm text-gray-600">
                      <strong>Message:</strong> {order.cake_message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-6">
            {/* UPI Payment */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-amber-800">UPI Payment</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">UPI ID:</p>
                    <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
                      <code className="flex-1">prgcakeland@paytm</code>
                      <button
                        onClick={() => copyToClipboard('prgcakeland@paytm')}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-gray-500 text-sm">QR Code</span>
                      </div>
                      <p className="text-xs text-gray-600">Scan to pay via UPI</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Transfer */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-amber-800">Bank Transfer</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Account Name:</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-medium">PRG THE CAKE LAND</code>
                      <button
                        onClick={() => copyToClipboard('PRG THE CAKE LAND')}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Account Number:</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-medium">1234567890123456</code>
                      <button
                        onClick={() => copyToClipboard('1234567890123456')}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">IFSC Code:</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-medium">SBIN0001234</code>
                      <button
                        onClick={() => copyToClipboard('SBIN0001234')}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Bank Name:</p>
                    <p className="text-sm font-medium">State Bank of India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Verification */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    After Payment
                  </h3>
                  <p className="text-green-700 mb-4">
                    Once you've completed the payment, click the button below to notify us. 
                    We'll verify your payment and update your order status within 2-4 hours.
                  </p>
                  <Button
                    onClick={handleVerifyPayment}
                    loading={paymentVerifying}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={order.status !== 'pending_payment'}
                  >
                    {order.status === 'pending_payment' ? 'I Have Paid - Verify Payment' : 'Payment Submitted for Verification'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-amber-100 border border-amber-400 rounded-lg p-6">
            <h4 className="font-bold text-amber-800 mb-2">Important Notes:</h4>
            <ul className="text-amber-700 text-left max-w-2xl mx-auto space-y-1">
              <li>• Please include your order ID in the payment reference/remarks</li>
              <li>• Keep your payment receipt/screenshot safe</li>
              <li>• Payment verification usually takes 2-4 hours during business hours</li>
              <li>• You'll receive email updates about your order status</li>
              <li>• For payment issues, contact us at +91 98765 43210</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};