import ServiceCard from './ServiceCard';
import { Button } from "@/components/ui/button";

interface ServicesListProps {
  services: Array<{
    _id: string;
    name: string;
    provider?: string;
    category: string;
    rating?: number;
    reviews?: number;
    location?: string;
    price?: string;
    description?: string;
    image?: string;
  }>;
  serviceIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string | null) => void;
}

const ServicesList = ({ services, serviceIcons, setSearchQuery, setSelectedType }: ServicesListProps) => {
  return (
    <div className="lg:col-span-3">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {services.length} {services.length === 1 ? 'Service' : 'Services'} Available
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <span>Sort by: </span>
          <select className="ml-2 border-none bg-transparent font-medium text-gray-900 focus:ring-0">
            <option>Recommended</option>
            <option>Highest Rated</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>
      
      {services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={() => {setSearchQuery(''); setSelectedType(null);}}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {services.map((service) => (
            <ServiceCard 
              key={service._id} 
              service={service} 
              serviceIcons={serviceIcons} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesList;
