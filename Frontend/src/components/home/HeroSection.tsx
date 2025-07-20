import { useState, useEffect, useRef } from 'react';
import { Search, Play, Star, MapPin, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { services } from '@/types/services';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate search suggestions based on services and history
  const getSearchSuggestions = () => {
    const suggestions = new Set<string>();
    
    // Add service names and types
    services.forEach(service => {
      suggestions.add(service.name.toLowerCase());
      suggestions.add(service.type);
      suggestions.add(service.provider.toLowerCase());
    });
    
    // Add popular keywords
    const popularKeywords = ['emergency', 'repair', 'installation', 'cleaning', 'maintenance', 'professional'];
    popularKeywords.forEach(keyword => suggestions.add(keyword));
    
    // Filter suggestions based on current search query
    const filteredSuggestions = Array.from(suggestions)
      .filter(suggestion => 
        suggestion.toLowerCase().includes(searchQuery.toLowerCase()) && 
        suggestion.toLowerCase() !== searchQuery.toLowerCase()
      )
      .slice(0, 8);
    
    return filteredSuggestions;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to search history
      const newHistory = [searchQuery.trim(), ...searchHistory.filter(item => item !== searchQuery.trim())].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Navigate to services page with search query
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/services?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    setSearchQuery(historyItem);
    navigate(`/services?search=${encodeURIComponent(historyItem)}`);
    setShowSuggestions(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const popularServices = ['Plumbing', 'Cleaning', 'Electrical', 'Painting'];

  return (
    <div className="relative w-full overflow-hidden theme-gradient-primary text-white">
      {/* Optimized background elements - removed two circles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-20 left-1/4 w-12 h-12 md:w-16 md:h-16 bg-white/15 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 md:w-12 md:h-12 bg-yellow-300/20 rounded-full animate-glow"></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium animate-fade-in border border-white/30">
              <Star className="h-4 w-4 mr-2 text-yellow-300 fill-current" />
              <span className="text-xs md:text-sm">Rated #1 Service Platform</span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in" style={{animationDelay: '0.2s'}}>
                Find Local Home Service 
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
                  Professionals
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{animationDelay: '0.4s'}}>
                Connect with verified local experts for all your home service needs. 
                From emergency repairs to home improvements.
              </p>
            </div>
            
            {/* Search Form */}
            <div className="animate-fade-in relative" style={{animationDelay: '0.6s'}} ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-white/20">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="What service do you need?"
                        className="pl-12 h-12 md:h-14 w-full bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl focus:bg-white/30 transition-all duration-300 text-base backdrop-blur-sm"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="hidden sm:flex items-center text-white/70 px-3 text-sm">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>Near you</span>
                      </div>
                      <Button 
                        type="submit" 
                        className="h-12 md:h-14 px-6 md:px-8 bg-white text-brand-600 hover:bg-gray-100 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base hover:scale-105"
                      >
                        Find Services
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg rounded-xl border border-white/30 shadow-2xl z-50 max-h-80 overflow-y-auto">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div className="p-3 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </button>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleHistoryClick(item)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Suggestions */}
                  <div className="p-3">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Suggestions</span>
                    <div className="space-y-1">
                      {getSearchSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors capitalize"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Popular Services */}
            <div className="animate-fade-in" style={{animationDelay: '0.8s'}}>
              <p className="text-sm mb-3 text-white/80">Popular services:</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {popularServices.map((service) => (
                  <button
                    key={service}
                    onClick={() => {
                      setSearchQuery(service);
                      navigate(`/services?search=${encodeURIComponent(service)}`);
                    }}
                    className="px-3 py-2 md:px-4 md:py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 border border-white/30 backdrop-blur-sm"
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Feature Card */}
          <div className="relative animate-fade-in" style={{animationDelay: '1s'}}>
            <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl">
              <div className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Play className="h-5 w-5 md:h-6 md:w-6 text-white fill-current" />
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    number: "1",
                    title: "Search & Compare",
                    description: "Find the perfect professional",
                    gradient: "from-blue-400 to-blue-500"
                  },
                  {
                    number: "2", 
                    title: "Book Instantly",
                    description: "Schedule at your convenience",
                    gradient: "from-purple-400 to-purple-500"
                  },
                  {
                    number: "3",
                    title: "Get It Done", 
                    description: "Quality work guaranteed",
                    gradient: "from-green-400 to-green-500"
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <span className="text-white font-bold text-sm md:text-base">{step.number}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-base md:text-lg">{step.title}</h3>
                      <p className="text-white/80 text-sm md:text-base">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
