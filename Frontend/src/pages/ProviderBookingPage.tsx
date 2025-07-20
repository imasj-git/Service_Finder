import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, User, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key');

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface Provider {
  _id: string;
  fullName: string;
  bio: string;
  hourlyRate: string;
  rating: number;
  reviews: number;
  image: string;
  category: {
    name: string;
  };
}

interface BookingFormData {
  address: string;
  city: string;
  notes: string;
}

const PaymentForm = ({
  amount,
  onSuccess,
  onError,
  bookingData
}: {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  bookingData: any;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('submitting');
    if (!stripe || !elements) {
      onError('Stripe is not loaded yet.');
      return;
    }

    // Validate booking data
    if (!bookingData.provider || !bookingData.bookingDate || !bookingData.bookingTime || !bookingData.address || !bookingData.city) {
      onError('Missing required booking information. Please fill in all fields.');
      return;
    }
    setProcessing(true);
    try {
      // 1. Create booking
      const token = localStorage.getItem('token');
      console.log('Creating booking with data:', {
        ...bookingData,
        totalPrice: amount,
      });
      const bookingRes = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...bookingData,
          totalPrice: amount, // Add the totalPrice field
        }),
      });
      const booking = await bookingRes.json();
      if (!bookingRes.ok) {
        console.error('Booking creation failed:', booking);
        throw new Error(booking.message || `Failed to create booking: ${bookingRes.status}`);
      }
      const bookingId = booking.data._id;

      // 2. Create payment intent
      const intentRes = await fetch(`${API_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, amount: amount * 100 }),
      });
      const intent = await intentRes.json();
      if (!intent.success) throw new Error(intent.message || 'Failed to create payment intent');

      // 3. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');
      const { error, paymentIntent } = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: { card: cardElement },
      });
      if (error) throw new Error(error.message || 'Payment failed');

      // 4. Confirm payment with backend
      const confirmRes = await fetch(`${API_URL}/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, paymentIntentId: paymentIntent.id }),
      });
      if (!confirmRes.ok) throw new Error('Payment confirmation failed');
      onSuccess();
    } catch (err: any) {
      onError(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              } as StripeCardElementOptions}
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Amount:</span>
          <span className="text-2xl font-bold text-brand-600">${amount}</span>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </Button>
    </form>
  );
};

const ProviderBookingPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    address: '',
    city: '',
    notes: '',
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  
  useEffect(() => {
    checkAuth();
    fetchProvider();
  }, [providerId]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      } else {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const fetchProvider = async () => {
    if (!providerId) return;
    
    try {
      const response = await fetch(`${API_URL}/provider/${providerId}`);
      const data = await response.json();
      
      if (data.success) {
        setProvider(data.data);
        setTotalAmount(parseFloat(data.data.hourlyRate) * duration);
      } else {
        setError('Provider not found');
      }
    } catch (error) {
      setError('Failed to load provider details');
    }
  };

  useEffect(() => {
    if (provider) {
      setTotalAmount(parseFloat(provider.hourlyRate) * duration);
    }
  }, [duration, provider]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };
  
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!date || !timeSlot) {
        toast({
          title: 'Missing Information',
          description: 'Please select a date and time slot.',
          variant: 'destructive',
        });
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.address || !formData.city) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in your address and city.',
          variant: 'destructive',
        });
        return;
      }
      setStep(3);
      return;
    }
  };

  const createBooking = async () => {
    if (!provider || !date || !timeSlot) return;

    setIsLoading(true);
    setError(null);

    try {
      // Calculate total amount
      const totalAmount = parseFloat(provider.hourlyRate) * duration;
      setTotalAmount(totalAmount);
      
      // Generate a temporary booking ID for payment
      const tempBookingId = 'temp_' + Date.now();
      setBookingId(tempBookingId);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to prepare booking');
      toast({
        title: 'Error',
        description: err.message || 'Failed to prepare booking',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: 'Payment Successful!',
      description: 'Your booking has been confirmed. Check your email for details.',
    });
    navigate(`/payment-success?bookingId=${bookingId}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment Failed',
      description: error,
      variant: 'destructive',
    });
  };
  
  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Book {provider.fullName}</h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Provider Info - Top Right */}
            <div className="xl:col-start-3 xl:row-start-1">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`${API_URL.replace('/api/v1', '')}/uploads/${provider.image}`}
                      alt={provider.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold">{provider.fullName}</h3>
                      <p className="text-sm text-gray-600">{provider.category.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>${provider.hourlyRate}/hour</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{provider.rating} ({provider.reviews} reviews)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {step >= 3 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span>${provider.hourlyRate}/hour</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-brand-600">${totalAmount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Booking Content */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>
                    Complete your booking in {4 - step} steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8 overflow-x-auto">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className={`rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 ${
                        step >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div className={`h-1 flex-1 mx-2 min-w-0 ${
                        step >= 2 ? 'bg-brand-600' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    
                    <div className="flex items-center min-w-0 flex-1">
                      <div className={`rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 ${
                        step >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className={`h-1 flex-1 mx-2 min-w-0 ${
                        step >= 3 ? 'bg-brand-600' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    
                    <div className="flex items-center min-w-0 flex-1">
                      <div className={`rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 ${
                        step >= 3 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className={`h-1 flex-1 mx-2 min-w-0 ${
                        step >= 4 ? 'bg-brand-600' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    
                    <div className="flex items-center flex-shrink-0">
                      <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                        step >= 4 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleBookingSubmit}>
                    {step === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date & Time</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="min-w-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Preferred Date
                            </label>
                            <div className="border border-gray-300 rounded-md p-2 overflow-hidden">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md"
                                disabled={(date) => {
                                  const now = new Date();
                                  now.setHours(0, 0, 0, 0);
                                  return date < now || date.getDay() === 0;
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="min-w-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Available Time Slots
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {timeSlots.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  className={`py-2 px-2 sm:px-4 text-center rounded-md text-sm whitespace-nowrap ${
                                    timeSlot === time
                                      ? 'bg-brand-600 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  onClick={() => setTimeSlot(time)}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (hours)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map((hours) => (
                              <button
                                key={hours}
                                type="button"
                                className={`py-2 px-3 sm:px-4 rounded-md text-sm whitespace-nowrap ${
                                  duration === hours
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => handleDurationChange(hours)}
                              >
                                {hours} {hours === 1 ? 'hour' : 'hours'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="min-w-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <Input
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Enter your address"
                              required
                              className="w-full"
                            />
                          </div>
                          
                          <div className="min-w-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <Input
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Enter your city"
                              required
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes
                          </label>
                          <Textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Any special requirements or notes..."
                            rows={4}
                          />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Confirm</h2>
                        
                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Provider:</span>
                            <span className="font-medium">{provider.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{date ? format(date, 'MMMM d, yyyy') : ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium">{timeSlot}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rate:</span>
                            <span className="font-medium">${provider.hourlyRate}/hour</span>
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-semibold">
                              <span>Total:</span>
                              <span className="text-brand-600">${totalAmount}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={createBooking}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? 'Creating Booking...' : 'Create Booking'}
                        </Button>
                      </div>
                    )}

                    {step < 3 && (
                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(Math.max(1, step - 1))}
                          disabled={step === 1}
                        >
                          Previous
                        </Button>
                        <Button type="submit">
                          {step === 1 ? 'Next' : 'Continue'}
                        </Button>
                      </div>
                    )}
                  </form>

                  {step === 4 && bookingId && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment</h2>
                      
                      <Elements stripe={stripePromise}>
                        <PaymentForm
                          amount={totalAmount}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          bookingData={{
                            provider: providerId,
                            bookingDate: date ? date.toISOString() : undefined,
                            bookingTime: timeSlot,
                            duration,
                            ...formData
                          }}
                        />
                      </Elements>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderBookingPage; 