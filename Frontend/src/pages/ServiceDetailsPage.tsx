import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Phone, Mail, ArrowLeft, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/services` : 'http://localhost:5000/api/v1/services';

const ServiceDetailsPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'faqs'>('overview');
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/${serviceId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Failed to fetch service');
        setService(data.data);
      })
      .catch(err => setError(err.message || 'Error fetching service'))
      .finally(() => setLoading(false));
  }, [serviceId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div 
          className="relative bg-cover bg-center h-64 md:h-80"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${service?.image})` 
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <Link to="/services" className="inline-flex items-center text-white mb-4 hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Services
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{service?.name}</h1>
            <p className="text-lg text-white max-w-2xl">{service?.description}</p>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'providers', 'faqs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'overview' | 'providers' | 'faqs')}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
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
          
          {/* Tab Content */}
          <div className="py-4">
            {loading ? (
              <div className="text-center py-12">Loading service details...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : !service ? (
              <div className="text-center py-12">Service not found.</div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Overview</h2>
                      <p className="text-gray-700 mb-6">{service.longDescription}</p>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">What's Included</h3>
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        <li>Professional assessment and consultation</li>
                        <li>Quality workmanship and attention to detail</li>
                        <li>Licensed and insured professionals</li>
                        <li>Cleanup after service completion</li>
                        <li>Follow-up quality assurance</li>
                      </ul>
                      
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Pricing</h3>
                        <p className="text-gray-700">{service.pricing}</p>
                        <p className="text-sm text-gray-500 mt-2">* Actual pricing may vary based on job complexity and materials required.</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Service</h3>
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-brand-600 mr-2" />
                          <span className="text-gray-700">Available 7 days a week</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-brand-600 mr-2" />
                          <span className="text-gray-700">8:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-brand-600 mr-2" />
                          <span className="text-gray-700">Service available in your area</span>
                        </div>
                      </div>
                      <Link to={`/booking/${service._id}`}>
                        <Button className="w-full mb-4">Book Now</Button>
                      </Link>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Need assistance?</p>
                        <div className="flex justify-center space-x-4">
                          <a href="tel:1234567890" className="flex items-center text-brand-600 hover:text-brand-800">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>Call us</span>
                          </a>
                          <a href="mailto:help@localheroes.com" className="flex items-center text-brand-600 hover:text-brand-800">
                            <Mail className="h-4 w-4 mr-1" />
                            <span>Email</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'providers' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Service Providers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(service.providers || []).map((provider: number) => (
                        <div key={provider} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="p-6">
                            <div className="flex items-center mb-4">
                              <img 
                                src={`https://randomuser.me/api/portraits/${provider % 2 === 0 ? 'women' : 'men'}/${20 + provider}.jpg`}
                                alt={`Provider ${provider}`}
                                className="w-16 h-16 rounded-full object-cover mr-4"
                              />
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">Professional Provider {provider}</h3>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < 4.5 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                  <span className="ml-1 text-sm text-gray-600">4.8 (120 reviews)</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4">Specialized in {service.name.toLowerCase()} with over 5 years of experience. Certified and insured professional.</p>
                            <Link to={`/providers/${provider}`}>
                              <Button variant="outline" className="w-full">View Profile</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'faqs' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                      {(service.faqs || []).map((faq: any, index: number) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetailsPage;
