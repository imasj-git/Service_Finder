import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Phone, Mail, Star, Award, Check, ArrowLeft, MessageSquare, ThumbsUp, User, CalendarCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  _id: string;
  fullName: string;
  bio: string;
  hourlyRate: string;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
  certifications: string[];
  servicesOffered: string[];
  serviceAreas: string[];
  availability: string;
  category: {
    name: string;
  };
  recentReviews?: Review[];
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    fullName: string;
  };
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const ProviderDetailsPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    fetchProvider();
    checkAuth();
  }, [providerId]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
  };

  const fetchProvider = async () => {
    if (!providerId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/provider/${providerId}`);
      const data = await response.json();
      
      if (data.success) {
        setProvider(data.data);
      } else {
        setError('Provider not found');
      }
    } catch (error) {
      setError('Failed to load provider details');
      console.error('Error fetching provider:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book this provider.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    navigate(`/booking/provider/${providerId}`);
  };

  const handleContact = () => {
    toast({
      title: "Contact Information",
      description: "You can reach out via phone or email. We'll connect you with the provider shortly.",
    });
  };

  const handleCheckAvailability = () => {
    if (!provider) return;
    toast({
      title: "Checking Availability",
      description: `${provider.fullName} is available ${provider.availability}. You can proceed with booking.`,
    });
  };

  const handleRequestQuote = () => {
    if (!provider) return;
    toast({
      title: "Quote Request Sent",
      description: `Your quote request has been sent to ${provider.fullName}. They will contact you within 24 hours.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading provider details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Provider not found'}</p>
            <Link to="/services">
              <Button>Back to Services</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {/* Provider Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/services" className="inline-flex items-center text-gray-600 mb-6 hover:text-brand-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Services
            </Link>
            
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <img 
                src={`${API_URL.replace('/api/v1', '')}/uploads/${provider.image}`}
                alt={provider.fullName} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mr-6 mb-4 md:mb-0"
                onError={(e) => {
                  e.currentTarget.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                }}
              />
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {provider.verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <ThumbsUp className="h-3 w-3 mr-1" /> Verified
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <MessageSquare className="h-3 w-3 mr-1" /> Quick Replies
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{provider.fullName}</h1>
                <p className="text-lg text-gray-600 mb-2">{provider.category?.name || 'Service Provider'}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(provider.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">{provider.rating}</span>
                  <span className="ml-1 text-gray-500">({provider.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button onClick={handleBookNow}>
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
                <Button variant="outline" onClick={handleContact}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {['about', 'services', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'about' | 'services' | 'reviews')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'about' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About {provider.fullName}</h2>
                  <p className="text-gray-700 mb-6">{provider.bio}</p>
                  
                  {provider.certifications && provider.certifications.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Certifications</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {provider.certifications.map((cert, index) => (
                          <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            <Award className="h-3.5 w-3.5 mr-1 text-brand-600" />
                            {cert}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {provider.serviceAreas && provider.serviceAreas.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Service Areas</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {provider.serviceAreas.map((area, index) => (
                          <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-brand-600" />
                            {area}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {activeTab === 'services' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Offered</h2>
                  {provider.servicesOffered && provider.servicesOffered.length > 0 ? (
                    <ul className="space-y-3 mb-6">
                      {provider.servicesOffered.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{service}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No specific services listed.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < Math.floor(provider.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-medium">{provider.rating}</span>
                      <span className="ml-1 text-gray-500">({provider.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  {provider.recentReviews && provider.recentReviews.length > 0 ? (
                    <div className="space-y-6">
                      {provider.recentReviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{review.user.fullName}</h3>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book this Provider</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-brand-600 mr-2" />
                    <span className="text-gray-700">{provider.availability}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-brand-600 mr-2" />
                    <span className="text-gray-700">Responds within 1 hour</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-brand-600 mr-2" />
                    <span className="text-gray-700">${provider.hourlyRate}/hour</span>
                  </div>
                </div>
                <Button className="w-full mb-2" onClick={handleCheckAvailability}>Check Availability</Button>
                <Button variant="outline" className="w-full" onClick={handleRequestQuote}>Request Quote</Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact {provider.fullName}</h3>
                <div className="space-y-4">
                  <a href="tel:1234567890" className="flex items-center text-brand-600 hover:text-brand-800">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>(123) 456-7890</span>
                  </a>
                  <button 
                    onClick={handleContact}
                    className="flex items-center text-brand-600 hover:text-brand-800"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderDetailsPage;
