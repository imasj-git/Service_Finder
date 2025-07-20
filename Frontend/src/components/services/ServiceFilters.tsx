import { Filter, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface ServiceFiltersProps {
  categories: Array<{ _id: string; name: string }>;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedRating: number | null;
  setSelectedRating: (rating: number | null) => void;
}

const ServiceFilters = ({ 
  categories,
  selectedType, 
  setSelectedType,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating
}: ServiceFiltersProps) => {
  const handleReset = () => {
    setSelectedType(null);
    setPriceRange([0, 200]);
    setSelectedRating(null);
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Filters</h3>
          <Button variant="ghost" size="sm" className="h-8 text-sm text-brand-600 hover:text-brand-700 hover:bg-brand-50" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <Separator className="my-4 bg-gradient-to-r from-brand-200 to-purple-200" />
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center text-gray-800">
            <Filter className="h-4 w-4 mr-2 text-brand-600" /> Category
          </h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedType(selectedType === cat._id ? null : cat._id)}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  selectedType === cat._id 
                    ? 'bg-gradient-to-r from-brand-50 to-purple-50 text-brand-700 font-medium border-l-4 border-brand-500 shadow-md' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-sm'
                }`}
              >
                <span className="capitalize">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
        <Separator className="my-4 bg-gradient-to-r from-brand-200 to-purple-200" />
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-800">Price Range</h4>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={200}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2 font-medium">
              <span className="text-brand-600">${priceRange[0]}/hr</span>
              <span className="text-purple-600">${priceRange[1]}/hr</span>
            </div>
          </div>
        </div>
        <Separator className="my-4 bg-gradient-to-r from-brand-200 to-purple-200" />
        <div>
          <h4 className="font-medium mb-3 text-gray-800">Rating</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`rating-${rating}`} 
                  className="mr-2 accent-brand-600" 
                  checked={selectedRating === rating}
                  onChange={(e) => setSelectedRating(e.target.checked ? rating : null)}
                />
                <label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer hover:text-brand-600 transition-colors">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium">& Up</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFilters;
