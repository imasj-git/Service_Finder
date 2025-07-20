import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Booking {
  _id: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
  provider?: {
    fullName: string;
    phoneNumber: string;
    hourlyRate: string;
    image: string;
  };
  service?: {
    _id: string;
    name: string;
    description?: string;
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
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/booking`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Booking status updated successfully',
        });
        fetchBookings();
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
    }
  };

  const completeBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/booking/${bookingId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Booking marked as completed',
        });
        fetchBookings();
      } else {
        throw new Error('Failed to complete booking');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete booking',
        variant: 'destructive',
      });
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'pending';
    if (filter === 'confirmed') return booking.status === 'confirmed';
    if (filter === 'completed') return booking.status === 'completed';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    if (filter === 'unpaid') return booking.paymentStatus === 'pending';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage all service and provider bookings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter bookings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.status === 'pending').length}
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
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
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            A list of all bookings with their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
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
              {filteredBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      {booking.user ? (
                        <>
                          <span className="font-medium">{booking.user.fullName}</span>
                          <span className="text-sm text-muted-foreground">{booking.user.email}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">User not found</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {booking.provider ? (
                        <>
                          <span className="font-medium">{booking.provider.fullName}</span>
                          <Badge variant="outline" className="text-xs">Provider</Badge>
                        </>
                      ) : booking.service ? (
                        <>
                          <span className="font-medium">{booking.service.name}</span>
                          <Badge variant="outline" className="text-xs">Service</Badge>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
                      </span>
                      <span className="text-sm text-muted-foreground">{booking.bookingTime}</span>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // View booking details
                          toast({
                            title: 'Booking Details',
                            description: `Address: ${booking.address}, ${booking.city}`,
                          });
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                      )}
                      
                      {booking.status === 'confirmed' && booking.paymentStatus === 'paid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => completeBooking(booking._id)}
                        >
                          Complete
                        </Button>
                      )}
                      
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;
