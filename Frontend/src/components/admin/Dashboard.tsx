
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Calendar, CheckCircle, XCircle, TrendingUp, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const stats = [
    { name: 'Total Bookings', value: '2,345', icon: Calendar, change: '+12%', color: 'bg-blue-500' },
    { name: 'Completed Services', value: '1,890', icon: CheckCircle, change: '+8%', color: 'bg-green-500' },
    { name: 'Pending Requests', value: '234', icon: TrendingUp, change: '+5%', color: 'bg-yellow-500' },
    { name: 'Canceled Bookings', value: '221', icon: XCircle, change: '-3%', color: 'bg-red-500' },
  ];

  const bookingData = [
    { name: 'Mon', bookings: 45 },
    { name: 'Tue', bookings: 52 },
    { name: 'Wed', bookings: 38 },
    { name: 'Thu', bookings: 61 },
    { name: 'Fri', bookings: 58 },
    { name: 'Sat', bookings: 72 },
    { name: 'Sun', bookings: 43 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 19000 },
    { name: 'Mar', revenue: 15000 },
    { name: 'Apr', revenue: 22000 },
    { name: 'May', revenue: 28000 },
    { name: 'Jun', revenue: 25000 },
  ];

  const recentBookings = [
    { id: 1, customer: 'John Smith', service: 'Plumbing', provider: 'Mike Johnson', status: 'Completed', amount: '$120' },
    { id: 2, customer: 'Sarah Wilson', service: 'Electrical', provider: 'Tom Brown', status: 'Pending', amount: '$95' },
    { id: 3, customer: 'David Lee', service: 'Gardening', provider: 'Lisa Green', status: 'In Progress', amount: '$80' },
    { id: 4, customer: 'Emily Davis', service: 'Painting', provider: 'Chris White', status: 'Completed', amount: '$200' },
  ];

  const topProviders = [
    { name: 'Mike Johnson', service: 'Plumbing', rating: 4.9, bookings: 156 },
    { name: 'Tom Brown', service: 'Electrical', rating: 4.8, bookings: 142 },
    { name: 'Lisa Green', service: 'Gardening', rating: 4.7, bookings: 128 },
    { name: 'Chris White', service: 'Painting', rating: 4.9, bookings: 134 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to Local Heroes Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.customer}</p>
                    <p className="text-sm text-gray-600">{booking.service} - {booking.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{booking.amount}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Service Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProviders.map((provider, index) => (
                <div key={provider.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-gray-600">{provider.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{provider.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{provider.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
