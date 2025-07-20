import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, User, CreditCard, CalendarCheck, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface Service {
  _id: string;
  name: string;
  description: string;
  price?: string | number;
  image?: string;
  category?: string;
  longDescription?: string;
  providers?: string[];
  faqs?: { question: string; answer: string }[];
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  phone?: string;
}

interface Booking {
  _id: string;
  paymentStatus: string;
  status: string;
  totalPrice: number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-4">{this.state.errorMessage || 'An unexpected error occurred'}</p>
              <div className="space-y-4">
                <Button onClick={() => window.location.reload()} aria-label="Try again">
                  Try Again
                </Button>
                <Link to="/services">
                  <Button variant="outline" aria-label="Back to services">
                    Back to Services
                  </Button>
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }
    return this.props.children;
  }
}

const PaymentForm: React.FC<{
  amount: number;
  onSuccess: (bookingId: string) => void;
  onError: (error: string) => void;
  bookingData: {
    service: string;
    bookingDate: Date | undefined;
    bookingTime: string | null;
    address: string;
    city: string;
    notes: string;
    totalPrice: number;
  };
}> = ({ amount, onSuccess, onError, bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const validateBookingData = () => {
    if (!bookingData.service) return 'Service ID is required';
    if (!bookingData.bookingDate) return 'Booking date is required';
    if (!bookingData.bookingTime) return 'Booking time is required';
    if (!bookingData.address) return 'Address is required';
    if (!bookingData.city) return 'City is required';
    if (bookingData.totalPrice <= 0) return 'Total price must be greater than zero';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('PaymentForm handleSubmit called with bookingData:', bookingData);

    // Validate bookingData
    const validationError = validateBookingData();
    if (validationError) {
      console.error('Invalid booking data:', validationError);
      onError(validationError);
      toast({ title: 'Error', description: validationError, variant: 'destructive' });
      return;
    }

    if (!stripe || !elements) {
      console.error('Stripe or elements not loaded');
      onError('Stripe is not loaded yet.');
      toast({ title: 'Error', description: 'Stripe is not loaded yet.', variant: 'destructive' });
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      console.log('Creating booking with data:', bookingData);
      const bookingRes = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      // Check if response is JSON
      const contentType = bookingRes.headers.get('content-type');
      if (!bookingRes.ok) {
        if (!contentType || !contentType.includes('application/json')) {
          const text = await bookingRes.text();
          console.error('Non-JSON response from /booking:', text);
          throw new Error(`Server returned ${bookingRes.status}: ${text.substring(0, 50)}...`);
        }
        const booking = await bookingRes.json();
        console.log('Booking response:', booking);
        throw new Error(booking.message || `Failed to create booking: ${bookingRes.status}`);
      }

      const booking = await bookingRes.json();
      console.log('Booking response:', booking);
      const bookingId = booking.data._id;

      console.log('Creating payment intent for booking:', bookingId, 'amount:', amount);
      const intentRes = await fetch(`${API_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, amount: Math.round(amount) }),
      });

      if (!intentRes.ok) {
        const contentType = intentRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await intentRes.text();
          console.error('Non-JSON response from /payment/create-payment-intent:', text);
          throw new Error(`Server returned ${intentRes.status}: ${text.substring(0, 50)}...`);
        }
        const intent = await intentRes.json();
        console.log('Payment intent response:', intent);
        throw new Error(intent.message || `Failed to create payment intent: ${intentRes.status}`);
      }

      const intent = await intentRes.json();
      console.log('Payment intent response:', intent);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');
      const { error, paymentIntent } = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        const errorMessages: { [key: string]: string } = {
          card_declined: 'Your card was declined. Please try another card.',
          insufficient_funds: 'Insufficient funds in your account.',
        };
        throw new Error(errorMessages[error.code] || error.message || 'Payment failed');
      }

      console.log('Confirming payment for paymentIntent:', paymentIntent.id);
      const confirmRes = await fetch(`${API_URL}/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, paymentIntentId: paymentIntent.id }),
      });

      if (!confirmRes.ok) {
        const contentType = confirmRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await confirmRes.text();
          console.error('Non-JSON response from /payment/confirm:', text);
          throw new Error(`Server returned ${confirmRes.status}: ${text.substring(0, 50)}...`);
        }
        const confirmData = await confirmRes.json();
        console.log('Payment confirmation response:', confirmData);
        throw new Error(confirmData.message || `Payment confirmation failed: ${confirmRes.status}`);
      }

      const confirmData = await confirmRes.json();
      console.log('Payment confirmation response:', confirmData);

      // Verify booking status
      const bookingCheck = await fetch(`${API_URL}/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!bookingCheck.ok) {
        const contentType = bookingCheck.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await bookingCheck.text();
          console.error('Non-JSON response from /bookings:', text);
          throw new Error(`Server returned ${bookingCheck.status}: ${text.substring(0, 50)}...`);
        }
        const bookingData = await bookingCheck.json();
        console.log('Booking check response:', bookingData);
        throw new Error(bookingData.message || `Failed to verify booking: ${bookingCheck.status}`);
      }

      const bookingDataRes = await bookingCheck.json();
      console.log('Booking after payment:', bookingDataRes);
      if (bookingDataRes.data.paymentStatus !== 'paid' || bookingDataRes.data.status !== 'confirmed') {
        throw new Error('Booking status not updated correctly');
      }

      toast({ title: 'Success', description: 'Payment confirmed successfully' });
      onSuccess(bookingId);
    } catch (err: any) {
      console.error('Payment error:', err.message);
      onError(err.message || 'Payment processing failed');
      toast({ title: 'Error', description: err.message || 'Payment processing failed', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="card-element">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-md p-3">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                invalid: { color: '#9e2146' },
              },
            }}
          />
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Amount:</span>
          <span className="text-2xl font-bold text-brand-600">
            ${(amount / 100).toFixed(2)}
          </span>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full"
        aria-label="Process payment"
      >
        {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  );
};

const BookingPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    console.log('BookingPage useEffect, step:', step, 'serviceId:', serviceId, 'API_URL:', API_URL);
    checkAuth();
    fetchService();
  }, [serviceId]);

  const checkAuth = async () => {
    setIsAuthLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response from /auth/me:', text);
          throw new Error(`Server returned ${response.status}: ${text.substring(0, 50)}...`);
        }
        const data = await response.json();
        console.log('Auth response:', data);
        throw new Error(data.message || `Auth failed: ${response.status}`);
      }
      const data = await response.json();
      console.log('Auth response:', data);
      if (data.success) {
        setUser(data.data);
        setFormData((prev) => ({
          ...prev,
          name: `${data.data.fname} ${data.data.lname}`,
          email: data.data.email,
          phone: data.data.phone || '',
        }));
      } else {
        console.log('Auth failed, redirecting to login');
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const parsePrice = (price: string | number | undefined): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const fetchService = async () => {
    if (!serviceId) {
      console.error('Invalid service ID');
      setError('Invalid service ID');
      toast({ title: 'Error', description: 'Invalid service ID', variant: 'destructive' });
      return;
    }
    try {
      const response = await fetch(`${API_URL}/services/${serviceId}`);
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response from /services:', text);
          throw new Error(`Server returned ${response.status}: ${text.substring(0, 50)}...`);
        }
        const data = await response.json();
        console.log('Service fetch response:', data);
        throw new Error(data.message || `Failed to fetch service: ${response.status}`);
      }
      const data = await response.json();
      console.log('Service fetch response:', data);
      if (data.success && data.data) {
        setService(data.data);
        const price = parsePrice(data.data.price);
        if (price > 0) {
          setTotalAmount(price * 100); // Convert to cents for Stripe
        } else {
          setError('Invalid service price');
          toast({ title: 'Error', description: 'Invalid service price', variant: 'destructive' });
        }
      } else {
        setError('Service not found');
        toast({ title: 'Error', description: 'Service not found', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Service fetch error:', error);
      setError('Failed to load service details');
      toast({ title: 'Error', description: 'Failed to load service details', variant: 'destructive' });
    }
  };

  const validateFormData = () => {
    if (!formData.name || formData.name.length > 100) {
      toast({ title: 'Error', description: 'Name is required and must not exceed 100 characters', variant: 'destructive' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: 'Error', description: 'Invalid email address', variant: 'destructive' });
      return false;
    }
    if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      toast({ title: 'Error', description: 'Invalid phone number', variant: 'destructive' });
      return false;
    }
    if (!formData.address || formData.address.length > 100) {
      toast({ title: 'Error', description: 'Address is required and must not exceed 100 characters', variant: 'destructive' });
      return false;
    }
    if (!/^[a-zA-Z\s,.-]+$/.test(formData.city)) {
      toast({ title: 'Error', description: 'Invalid city name', variant: 'destructive' });
      return false;
    }
    if (formData.notes && formData.notes.length > 500) {
      toast({ title: 'Error', description: 'Notes cannot exceed 500 characters', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleBookingSubmit called, step:', step);
    if (step === 1) {
      if (!date || !timeSlot) {
        toast({ title: 'Error', description: 'Please select a date and time slot', variant: 'destructive' });
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!validateFormData()) return;
      setStep(3);
      return;
    }
    if (step === 3) {
      if (totalAmount <= 0) {
        toast({ title: 'Error', description: 'Invalid service price', variant: 'destructive' });
        return;
      }
      if (!serviceId || !date || !timeSlot || !formData.address || !formData.city) {
        toast({ title: 'Error', description: 'Incomplete booking data', variant: 'destructive' });
        return;
      }
      setStep(4);
      return;
    }
  };

  const handlePaymentSuccess = (bookingId: string) => {
    console.log('Payment successful, bookingId:', bookingId);
    toast({
      title: 'Booking Confirmed!',
      description: `Your appointment has been scheduled for ${date ? format(date, 'MMMM d, yyyy') : ''} at ${timeSlot}. Check your email for details.`,
    });
    setStep(5);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setError(error);
    toast({ title: 'Error', description: error, variant: 'destructive' });
  };

  if (isAuthLoading || !service || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            {isAuthLoading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-4">{error || 'Failed to load service details'}</p>
                <Link to="/services">
                  <Button aria-label="Back to services">Back to Services</Button>
                </Link>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-[700px] overflow-x-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Book {service.name}</h1>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center flex-grow">
                    <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div className={`h-1 flex-grow mx-2 ${step >= 2 ? 'bg-brand-600' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="flex items-center flex-grow">
                    <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div className={`h-1 flex-grow mx-2 ${step >= 3 ? 'bg-brand-600' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="flex items-center flex-grow">
                    <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div className={`h-1 flex-grow mx-2 ${step >= 4 ? 'bg-brand-600' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="flex items-center flex-grow">
                    <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 4 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className={`h-1 flex-grow mx-2 ${step >= 5 ? 'bg-brand-600' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="flex items-center">
                    <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 5 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {step <= 3 && (
                  <form onSubmit={handleBookingSubmit}>
                    {step === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date & Time</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Preferred Date
                            </label>
                            <div className="border border-gray-300 rounded-md p-2">
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
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Available Time Slots
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {timeSlots.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  className={`py-2 px-4 text-center rounded-md text-sm ${
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
                        <div className="pt-4 flex justify-end">
                          <Button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={!date || !timeSlot}
                            aria-label="Continue to personal information"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              disabled={!!user}
                              aria-required="true"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              disabled={!!user}
                              aria-required="true"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              disabled={!!user}
                              aria-required="true"
                            />
                          </div>
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                              Service Address
                            </label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                              aria-required="true"
                            />
                          </div>
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              aria-required="true"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Special Instructions (Optional)
                          </label>
                          <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            aria-label="Special instructions"
                          />
                        </div>
                        <div className="pt-4 flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            aria-label="Go back to date and time selection"
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setStep(3)}
                            disabled={!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city}
                            aria-label="Continue to booking summary"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">Service Details</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start">
                              <CalendarCheck className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Date & Time</p>
                                <p className="text-gray-600">
                                  {date ? format(date, 'MMMM d, yyyy') : 'Not selected'} at {timeSlot || 'Not selected'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <User className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Customer</p>
                                <p className="text-gray-600">{formData.name}</p>
                                <p className="text-gray-600">{formData.email}</p>
                                <p className="text-gray-600">{formData.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Service Location</p>
                                <p className="text-gray-600">{formData.address}</p>
                                <p className="text-gray-600">{formData.city}</p>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Service Information</h3>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Service:</span>
                              <span className="font-medium">{service.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium">${(totalAmount / 100).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(2)}
                            aria-label="Go back to personal information"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading || totalAmount <= 0 || !serviceId || !date || !timeSlot || !formData.address || !formData.city}
                            aria-label="Proceed to payment"
                          >
                            {isLoading ? 'Processing...' : 'Proceed to Payment'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment</h2>
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        amount={totalAmount}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        bookingData={{
                          service: serviceId || '',
                          bookingDate: date,
                          bookingTime: timeSlot,
                          address: formData.address,
                          city: formData.city,
                          notes: formData.notes,
                          totalPrice: totalAmount / 100,
                        }}
                      />
                    </Elements>
                    <div className="pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(3)}
                        aria-label="Go back to booking summary"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div className="space-y-6 text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Successful!</h2>
                    <p className="text-gray-600 mb-6">
                      Your appointment for <span className="font-medium">{service.name}</span> has been scheduled for{' '}
                      <span className="font-medium">{date ? format(date, 'MMMM d, yyyy') : 'Not selected'}</span> at{' '}
                      <span className="font-medium">{timeSlot || 'Not selected'}</span>.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer:</span>
                          <span className="font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{formData.address}, {formData.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Paid:</span>
                          <span className="font-medium">${(totalAmount / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Link to="/services">
                        <Button aria-label="Back to services">Back to Services</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default BookingPage;