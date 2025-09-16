import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  totalCustomers: number;
  pendingVerification: number;
  monthlyRevenue: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    pendingVerification: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
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
          order.status === 'pending_verification'
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-amber-800 mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
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

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
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

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Pending Verification</p>
                <p className="text-3xl font-bold text-red-800">{stats.pendingVerification}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
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

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
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

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
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
          <h2 className="text-2xl font-bold text-amber-800">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <h3 className="font-bold text-blue-800 mb-2">View All Orders</h3>
              <p className="text-blue-600 text-sm">Manage and track orders</p>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <h3 className="font-bold text-green-800 mb-2">Verify Payments</h3>
              <p className="text-green-600 text-sm">Process pending payments</p>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <h3 className="font-bold text-purple-800 mb-2">Manage Products</h3>
              <p className="text-purple-600 text-sm">Add or edit products</p>
            </button>
            
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
              <h3 className="font-bold text-orange-800 mb-2">Customer Reports</h3>
              <p className="text-orange-600 text-sm">View customer analytics</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};