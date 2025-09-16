import React from 'react';
import { Star, Gift, Calendar, Mail, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            Please Sign In
          </h1>
          <p className="text-xl text-gray-600">
            You need to be signed in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            My Profile
          </h1>
          <p className="text-xl text-amber-700">
            Manage your account and loyalty rewards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-amber-800">Profile Information</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 mb-6">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name}
                      className="w-20 h-20 rounded-full border-4 border-amber-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-amber-800">{user.name}</h3>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Member since {new Date(user.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-amber-600" />
                      <h4 className="font-bold text-amber-800">Loyalty Status</h4>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">
                      {user.loyalty_points >= 1000 ? 'Gold' : user.loyalty_points >= 500 ? 'Silver' : 'Bronze'} Member
                    </p>
                    <p className="text-sm text-amber-700">
                      {user.loyalty_points >= 1000 ? 'Enjoy premium benefits!' : 
                       user.loyalty_points >= 500 ? `${1000 - user.loyalty_points} points to Gold` :
                       `${500 - user.loyalty_points} points to Silver`}
                    </p>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="w-5 h-5 text-pink-600" />
                      <h4 className="font-bold text-pink-800">Total Savings</h4>
                    </div>
                    <p className="text-2xl font-bold text-pink-600">
                      ₹{(user.loyalty_points * 0.1).toFixed(2)}
                    </p>
                    <p className="text-sm text-pink-700">
                      Earned through loyalty points
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loyalty Points */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-amber-800">Loyalty Points</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-pink-600 mb-2">
                    {user.loyalty_points}
                  </div>
                  <p className="text-gray-600">Available Points</p>
                  <p className="text-sm text-green-600 mt-1">
                    Worth ₹{(user.loyalty_points * 0.1).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium text-green-800">How to Earn</p>
                    <p className="text-sm text-green-600">1 point per ₹10 spent</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-800">How to Redeem</p>
                    <p className="text-sm text-blue-600">Contact us to use your points</p>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="font-medium text-amber-800">Next Milestone</p>
                    <div className="mt-2">
                      <div className="bg-amber-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(100, ((user.loyalty_points % 500) / 500) * 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        {500 - (user.loyalty_points % 500)} points to next level
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Benefits */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-xl font-bold text-amber-800">Member Benefits</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2" />
                    <p>Earn points on every purchase</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2" />
                    <p>Exclusive member-only offers</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2" />
                    <p>Priority customer support</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2" />
                    <p>Birthday special discounts</p>
                  </div>
                  {user.loyalty_points >= 500 && (
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gold rounded-full mt-2" />
                      <p className="text-amber-600 font-medium">
                        Silver/Gold: Free delivery on orders above ₹500
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};