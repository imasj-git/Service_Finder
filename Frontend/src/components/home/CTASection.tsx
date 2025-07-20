
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 hero-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
          Find the perfect professional for your home service needs today. 
          Browse through our verified providers or list your services on our platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/services">
            <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100">
              Find a Service
            </Button>
          </Link>
          <Link to="/become-provider">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-brand-600">
              Become a Provider
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
