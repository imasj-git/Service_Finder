
import { Check, Search, Calendar, Star } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'Find Services',
    description: 'Search for services you need and browse through our trusted professionals.',
  },
  {
    id: 2,
    icon: Calendar,
    title: 'Book Appointments',
    description: 'Choose a convenient time slot and book your service appointment.',
  },
  {
    id: 3,
    icon: Check,
    title: 'Get it Done',
    description: 'Sit back as our verified professionals complete your service needs.',
  },
  {
    id: 4,
    icon: Star,
    title: 'Leave a Review',
    description: 'Share your experience and help others find great service providers.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Finding and booking home services has never been easier
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 text-brand-600 mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {step.id < steps.length && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
