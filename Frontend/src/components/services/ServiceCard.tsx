import { MapPin, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: {
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
  };
  serviceIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>;
}

const ServiceCard = ({ service, serviceIcons }: ServiceCardProps) => {
  const ServiceIcon = serviceIcons[service.category] || (() => null);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0 h-48 md:h-auto md:w-48">
          <img 
            src={service.image || '/placeholder.svg'} 
            alt={service.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6 flex-grow">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <div className="flex items-center mb-1">
                <ServiceIcon className={`h-4 w-4 mr-2 text-service-${service.category}`} />
                <span className="text-sm font-medium text-gray-500 capitalize">{service.category}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
              <p className="text-brand-600 font-medium">{service.provider || ''}</p>
            </div>
            <div className="text-right mt-2 md:mt-0">
              <div className="text-xl font-bold text-gray-900 mb-1">{service.price || '-'}</div>
              <div className="flex items-center justify-end">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{service.rating ?? '-'}</span>
                <span className="ml-1 text-gray-500">({service.reviews ?? 0})</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mt-4 mb-4">{service.description || ''}</p>
          
          <div className="flex flex-wrap justify-between items-center mt-2">
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{service.location || ''}</span>
            </div>
            <Link to={`/services/${service._id}`}>
              <Button>View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
