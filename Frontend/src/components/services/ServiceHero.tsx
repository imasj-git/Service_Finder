import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { services } from '@/types/services';
import { useNavigate } from 'react-router-dom';

interface ServiceHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ServiceHero = ({ searchQuery, setSearchQuery }: ServiceHeroProps) => {
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
      .slice(0, 6);
    
    return filteredSuggestions;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Trigger search
    const formEvent = new Event('submit', { bubbles: true, cancelable: true });
    document.querySelector('form')?.dispatchEvent(formEvent);
  };

  const handleHistoryClick = (historyItem: string) => {
    setSearchQuery(historyItem);
    setShowSuggestions(false);
    // Trigger search
    const formEvent = new Event('submit', { bubbles: true, cancelable: true });
    document.querySelector('form')?.dispatchEvent(formEvent);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="theme-gradient-primary py-16 relative overflow-hidden">
      {/* Background decoration - removed circles */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Find the Perfect 
            <span className="block bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              Service Provider
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Browse through our extensive list of verified professionals for all your home service needs
          </p>
        </div>
        
        <div className="animate-fade-in relative" style={{animationDelay: '0.3s'}} ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto bg-white/15 backdrop-blur-lg rounded-2xl p-3 border border-white/20">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search services, providers, or keywords..."
                  className="pl-12 h-12 w-full bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl focus:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-8 whitespace-nowrap bg-white text-brand-600 hover:bg-gray-100 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Search Services
              </Button>
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
                
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceHero;
