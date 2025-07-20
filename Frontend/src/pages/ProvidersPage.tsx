import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Clock, User, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Provider {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  category: {
    _id: string;
    name: string;
  };
  yearsOfExperience: string;
  hourlyRate: string;
  address: string;
  city: string;
  bio: string;
  image: string;
  rating: number;
  reviews: number;
  verified: boolean;
  isTopRated: boolean;
  certifications: string[];
  serviceAreas: string[];
  servicesOffered: string[];
  availability: string;
}

interface Category {
  _id: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  const fetchProviders = async () => {
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

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || !selectedCategory || provider.category._id === selectedCategory;
    
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && parseFloat(provider.hourlyRate) <= 50) ||
                        (priceRange === 'medium' && parseFloat(provider.hourlyRate) > 50 && parseFloat(provider.hourlyRate) <= 100) ||
                        (priceRange === 'high' && parseFloat(provider.hourlyRate) > 100);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return parseFloat(a.hourlyRate) - parseFloat(b.hourlyRate);
      case 'price-high':
        return parseFloat(b.hourlyRate) - parseFloat(a.hourlyRate);
      case 'experience':
        return parseInt(b.yearsOfExperience) - parseInt(a.yearsOfExperience);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading providers...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Providers</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchProviders} variant="outline">
                Try Again
              </Button>
            </div>
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Service Provider</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with skilled professionals who are ready to help with your needs. 
              Browse, compare, and book the best service providers in your area.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under $50/hr</SelectItem>
                  <SelectItem value="medium">$50-$100/hr</SelectItem>
                  <SelectItem value="high">Over $100/hr</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {sortedProviders.length} provider{sortedProviders.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Providers Grid */}
          {sortedProviders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProviders.map((provider) => (
                <Card key={provider._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <img
                        src={`${API_URL.replace('/api/v1', '')}/uploads/${provider.image}`}
                        alt={provider.fullName}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                        onError={(e) => {
                          e.currentTarget.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {provider.fullName}
                        </h3>
                        <Badge variant="outline" className="mb-2">
                          {provider.category.name}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {provider.city}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {provider.yearsOfExperience} experience
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {provider.bio}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({provider.reviews})</span>
                      </div>
                      <div className="text-lg font-bold text-brand-600">
                        ${provider.hourlyRate}/hr
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.verified && (
                        <Badge variant="default" className="text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {provider.isTopRated && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Top Rated
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Link to={`/providers/${provider._id}`}>
                        <Button className="w-full">Book Now</Button>
                      </Link>
                      <Link to={`/providers/${provider._id}`}>
                        <Button variant="outline" className="w-full">View Profile</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProvidersPage; 