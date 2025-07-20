import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Booking {
  _id: string;
  provider?: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    hourlyRate: string;
    image: string;
  };
  service?: {
    _id: string;
    name: string;
  };
  bookingDate: string;
  bookingTime: string;
  duration: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'not_required';
  address: string;
  city: string;
  notes?: string;
  createdAt: string;
  isReviewed: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to view your bookings',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`${API_URL}/booking/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
      not_required: { color: 'bg-gray-100 text-gray-800', label: 'Not Required' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleReviewProvider = (booking: Booking) => {
    // Navigate to review page or open review modal
    toast({
      title: 'Review Provider',
      description: `Review ${booking.provider.fullName} for your completed service`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage your service bookings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>
                A list of all your service bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
                  <Button onClick={() => window.location.href = '/services'}>
                    Browse Services
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service/Provider</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell>
                          {booking.provider ? (
                            <div className="flex items-center space-x-3">
                              <img
                                src={`${API_URL.replace('/api/v1', '')}/uploads/${booking.provider.image}`}
                                alt={booking.provider.fullName}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                                }}
                              />
                              <div>
                                <div className="font-medium">{booking.provider.fullName}</div>
                                <div className="text-sm text-gray-500">${booking.provider.hourlyRate}/hour</div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500">To be assigned</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
                            </span>
                            <span className="text-sm text-gray-500">{booking.bookingTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">${booking.totalPrice}</span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {booking.status === 'completed' && !booking.isReviewed && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReviewProvider(booking)}
                              >
                                <Star className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            )}
                            
                            {booking.paymentStatus === 'pending' && booking.status === 'pending' && booking.provider && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Navigate to payment page
                                  window.location.href = `/booking/provider/${booking.provider._id}`;
                                }}
                              >
                                Pay Now
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: 'Booking Details',
                                  description: `Address: ${booking.address}, ${booking.city}${booking.notes ? ` | Notes: ${booking.notes}` : ''}`,
                                });
                              }}
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookingsPage; 