
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Star, Search, Eye, Trash2, Flag } from 'lucide-react';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const reviews = [
    {
      id: 1,
      customer: 'John Smith',
      provider: 'Mike Johnson',
      service: 'Plumbing',
      rating: 5,
      comment: 'Excellent service! Mike was professional and fixed the issue quickly.',
      date: '2024-01-15',
      status: 'Published',
      helpful: 12
    },
    {
      id: 2,
      customer: 'Sarah Wilson',
      provider: 'Tom Brown',
      service: 'Electrical',
      rating: 4,
      comment: 'Good work, arrived on time and explained everything clearly.',
      date: '2024-01-14',
      status: 'Published',
      helpful: 8
    },
    {
      id: 3,
      customer: 'David Lee',
      provider: 'Lisa Green',
      service: 'Gardening',
      rating: 2,
      comment: 'Service was okay but took longer than expected.',
      date: '2024-01-13',
      status: 'Flagged',
      helpful: 3
    },
    {
      id: 4,
      customer: 'Emily Davis',
      provider: 'Chris White',
      service: 'Painting',
      rating: 5,
      comment: 'Amazing work! Very satisfied with the quality and professionalism.',
      date: '2024-01-12',
      status: 'Published',
      helpful: 15
    },
  ];

  const filteredReviews = reviews.filter(review =>
    review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Flagged':
        return 'bg-red-100 text-red-800';
      case 'Hidden':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h1>
        <p className="text-gray-600">Manage customer reviews and ratings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">1,156</p>
              <p className="text-sm text-gray-600">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">23</p>
              <p className="text-sm text-gray-600">Flagged</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{review.customer[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{review.customer}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>for {review.provider}</span>
                        <span>•</span>
                        <Badge variant="secondary">{review.service}</Badge>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                  <span className="font-medium">{review.rating}/5</span>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {review.helpful} people found this helpful
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-orange-600">
                      <Flag className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;
