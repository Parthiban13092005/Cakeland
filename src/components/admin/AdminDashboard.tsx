import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Clock, CheckCircle, Users, TrendingUp, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import type { Order, Product } from '../../types';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  totalCustomers: number;
  pendingVerification: number;
  monthlyRevenue: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    pendingVerification: 0,
    monthlyRevenue: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      // Fetch orders data
      const { data: orders } = await supabase
        .from('orders')
        .select('*');

      // Fetch customers data
      const { data: customers } = await supabase
        .from('users')
        .select('*');

      if (orders) {
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => 
          ['pending_payment', 'payment_verified', 'baking', 'out_for_delivery'].includes(order.status)
        ).length;
        const pendingVerification = orders.filter(order => 
          order.status === 'pending_payment'
        ).length;
        
        const todayOrders = orders.filter(order => 
          order.created_at.startsWith(today)
        );
        const todayRevenue = todayOrders.reduce((sum, order) => 
          sum + parseFloat(order.total_amount), 0
        );

        const monthlyOrders = orders.filter(order => 
          order.created_at.startsWith(thisMonth)
        );
        const monthlyRevenue = monthlyOrders.reduce((sum, order) => 
          sum + parseFloat(order.total_amount), 0
        );

        setStats({
          totalOrders,
          pendingOrders,
          todayRevenue,
          totalCustomers: customers?.length || 0,
          pendingVerification,
          monthlyRevenue
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (data) setProducts(data);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    if (!error) {
      fetchOrders();
      fetchDashboardStats();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-red-100 text-red-800';
      case 'payment_verified': return 'bg-blue-100 text-blue-800';
      case 'baking': return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush to-lavender">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'orders', label: 'Orders' },
              { id: 'products', label: 'Products' },
              { id: 'customers', label: 'Customers' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-rose-pink text-rose-pink'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'dashboard' && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8 font-display">Admin Dashboard</h1>
      
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                      <p className="text-3xl font-bold text-blue-800">{stats.totalOrders}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">Pending Orders</p>
                      <p className="text-3xl font-bold text-yellow-800">{stats.pendingOrders}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Pending Payment</p>
                      <p className="text-3xl font-bold text-red-800">{stats.pendingVerification}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Today's Revenue</p>
                      <p className="text-3xl font-bold text-green-800">₹{stats.todayRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Total Customers</p>
                      <p className="text-3xl font-bold text-purple-800">{stats.totalCustomers}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-600 text-sm font-medium">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-indigo-800">₹{stats.monthlyRevenue.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-800 font-display">Quick Actions</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors transform hover:scale-105"
                  >
                    <h3 className="font-bold text-blue-800 mb-2">View All Orders</h3>
                    <p className="text-blue-600 text-sm">Manage and track orders</p>
                  </button>
            
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors transform hover:scale-105"
                  >
                    <h3 className="font-bold text-green-800 mb-2">Verify Payments</h3>
                    <p className="text-green-600 text-sm">Process pending payments</p>
                  </button>
            
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors transform hover:scale-105"
                  >
                    <h3 className="font-bold text-purple-800 mb-2">Manage Products</h3>
                    <p className="text-purple-600 text-sm">Add or edit products</p>
                  </button>
            
                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors transform hover:scale-105"
                  >
                    <h3 className="font-bold text-orange-800 mb-2">Customer Reports</h3>
                    <p className="text-orange-600 text-sm">View customer analytics</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8 font-display">Order Management</h1>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-800">All Orders</h2>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2 font-mono text-sm">
                            {order.id.substring(0, 8).toUpperCase()}
                          </td>
                          <td className="px-4 py-2">
                            <div className="text-sm">
                              <div className="font-medium">Customer #{order.user_id.substring(0, 8)}</div>
                              <div className="text-gray-500">{order.delivery_date}</div>
                            </div>
                          </td>
                          <td className="px-4 py-2 font-bold text-rose-pink">
                            ₹{order.total_amount}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              {order.status === 'pending_payment' && (
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'payment_verified')}
                                  className="text-green-600 hover:text-green-800"
                                  title="Verify Payment"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {order.status === 'payment_verified' && (
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'baking')}
                                  className="text-yellow-600 hover:text-yellow-800"
                                  title="Start Baking"
                                >
                                  <Package className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 font-display">Product Management</h1>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <img
                    src={product.image_url || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-rose-pink">₹{product.price}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8 font-display">Customer Management</h1>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-800">Customer List</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Customer management features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};