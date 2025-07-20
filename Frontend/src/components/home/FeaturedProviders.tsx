
import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface Provider {
  _id: string;
  fullName: string;
  category: {
    name: string;
  };
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
  isTopRated: boolean;
  hourlyRate: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const FeaturedProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllProviders();
  }, []);

  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/provider`);
      const data = await response.json();
      
      if (data.success) {
        setProviders(data.data);
      } else {
        setError('Failed to load providers');
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top-Rated Service Providers</h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Meet our highest-rated professionals with proven track records of excellence
              </p>
            </div>
            <Link to="/providers">
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Providers
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top-Rated Service Providers</h2>
            <p className="text-lg text-gray-600 mb-8">Unable to load providers at the moment</p>
            <Button onClick={fetchAllProviders} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Service Providers</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover skilled professionals ready to help with your needs
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Services
            </Button>
          </Link>
        </div>
        
        {providers.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No providers available yet</h3>
            <p className="text-gray-600">Check back soon for our service professionals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {providers.map((provider) => (
              <div key={provider._id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <img 
                      src={`${API_URL.replace('/api/v1', '')}/uploads/${provider.image}`}
                      alt={provider.fullName} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                      onError={(e) => {
                        e.currentTarget.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{provider.fullName}</h3>
                      <Link to={`/services`} className="text-brand-600 hover:underline">
                        {provider.category?.name || 'Service'} Expert
                      </Link>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-gray-700">{provider.rating}</span>
                        <span className="ml-1 text-gray-500">({provider.reviews} reviews)</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ${provider.hourlyRate}/hour
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mb-4">
                    {provider.verified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <ThumbsUp className="h-3 w-3 mr-1" /> Verified
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <MessageSquare className="h-3 w-3 mr-1" /> Quick Replies
                    </span>
                  </div>
                  
                  <Link to={`/providers/${provider._id}`}>
                    <Button variant="default" className="w-full">Book Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProviders;
