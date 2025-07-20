import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    if (bookingId) {
      fetchBookingDetails(bookingId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/booking/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBooking(data.data);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50">
      <Navbar />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-600">
              Your booking has been confirmed and payment processed successfully.
            </p>
          </div>

          {/* Booking Details */}
          {booking && (
            <Card className="shadow-xl border-green-200 mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-green-800">Booking Confirmation</CardTitle>
                <CardDescription>Your booking details and next steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{booking.bookingTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Provider</p>
                      <p className="font-medium">{booking.provider?.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{booking.address}, {booking.city}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">${booking.totalPrice}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">What's Next?</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• You'll receive a confirmation email shortly</li>
                    <li>• Your service provider will contact you before the appointment</li>
                    <li>• You can track your booking status in your profile</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/profile')}
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-brand-200 text-brand-600 hover:bg-brand-50"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage; 