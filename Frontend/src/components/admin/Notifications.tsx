
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, Calendar, User, CreditCard, Star, AlertTriangle, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const [filter, setFilter] = useState('All');

  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      message: 'John Smith has requested plumbing service for Jan 20, 2024',
      time: '5 minutes ago',
      read: false,
      priority: 'high',
      icon: Calendar
    },
    {
      id: 2,
      type: 'provider',
      title: 'New Provider Registration',
      message: 'Alex Rodriguez has applied to become a service provider',
      time: '15 minutes ago',
      read: false,
      priority: 'medium',
      icon: User
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $120 received from Sarah Wilson',
      time: '1 hour ago',
      read: true,
      priority: 'low',
      icon: CreditCard
    },
    {
      id: 4,
      type: 'review',
      title: 'New Review Submitted',
      message: 'David Lee left a 5-star review for Mike Johnson',
      time: '2 hours ago',
      read: true,
      priority: 'low',
      icon: Star
    },
    {
      id: 5,
      type: 'alert',
      title: 'Service Provider Issue',
      message: 'Tom Brown has reported an issue with a recent booking',
      time: '3 hours ago',
      read: false,
      priority: 'high',
      icon: AlertTriangle
    },
    {
      id: 6,
      type: 'booking',
      title: 'Booking Completed',
      message: 'Electrical service for Emily Davis has been completed',
      time: '4 hours ago',
      read: true,
      priority: 'low',
      icon: CheckCircle
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !notification.read;
    return notification.type === filter.toLowerCase();
  });

  const getIconColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'text-blue-500';
      case 'provider':
        return 'text-green-500';
      case 'payment':
        return 'text-purple-500';
      case 'review':
        return 'text-yellow-500';
      case 'alert':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with platform activities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
          <Button variant="outline">Mark All Read</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notifications.filter(n => n.priority === 'high').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.time.includes('hour') || n.time.includes('minute')).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Notifications</CardTitle>
            <div className="flex space-x-2">
              {['All', 'Unread', 'Booking', 'Provider', 'Payment', 'Review', 'Alert'].map((filterType) => (
                <Button
                  key={filterType}
                  size="sm"
                  variant={filter === filterType ? 'default' : 'outline'}
                  onClick={() => setFilter(filterType)}
                >
                  {filterType}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${getIconColor(notification.type)}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    {!notification.read && (
                      <Button size="sm" variant="ghost">
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
