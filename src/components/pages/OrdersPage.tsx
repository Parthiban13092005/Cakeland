import React, { useEffect, useState } from 'react';
import { Clock, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order, OrderStatus } from '../../types';

interface OrdersPageProps {
  onPageChange: (page: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onPageChange }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
      case 'pending_verification':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'payment_verified':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'baking':
        return <Package className="w-5 h-5 text-purple-600" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return 'Pending Payment';
      case 'pending_verification':
        return 'Payment Verification Pending';
      case 'payment_verified':
        return 'Payment Verified';
      case 'baking':
        return 'Baking in Progress';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
      case 'pending_verification':
        return 'text-yellow-600 bg-yellow-50';
      case 'payment_verified':
        return 'text-blue-600 bg-blue-50';
      case 'baking':
        return 'text-purple-600 bg-purple-50';
      case 'out_for_delivery':
        return 'text-orange-600 bg-orange-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
            You need to be signed in to view your orders.
          </p>
        </div>
      </div>
    );
  }

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            My Orders
          </h1>
          <p className="text-xl text-amber-700">
            Track your cake orders and delivery status
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              No Orders Yet
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              You haven't placed any orders yet. Start by browsing our delicious cakes!
            </p>
            <button
              onClick={() => onPageChange('menu')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-amber-800">
                        Order #{order.id.substring(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 md:mt-0">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-bold text-amber-800 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-pink-600">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                        <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                          <span>Total:</span>
                          <span className="text-pink-600">₹{order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h4 className="font-bold text-amber-800 mb-3">Delivery Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Address:</span>
                          <p className="text-gray-600">{order.delivery_address}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Date:</span>
                          <span className="text-gray-600 ml-2">{order.delivery_date}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Time:</span>
                          <span className="text-gray-600 ml-2">{order.delivery_time}</span>
                        </div>
                        {order.cake_message && (
                          <div>
                            <span className="font-medium text-gray-700">Message:</span>
                            <p className="text-gray-600">"{order.cake_message}"</p>
                          </div>
                        )}
                        {order.payment_reference && (
                          <div>
                            <span className="font-medium text-gray-700">Payment Reference:</span>
                            <span className="text-gray-600 ml-2 font-mono">{order.payment_reference}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4">
                        {order.status === 'pending_payment' && (
                          <button
                            onClick={() => onPageChange(`payment-${order.id}`)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                          >
                            Complete Payment
                          </button>
                        )}
                        {order.admin_notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-800">Admin Notes:</p>
                            <p className="text-sm text-blue-700">{order.admin_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};