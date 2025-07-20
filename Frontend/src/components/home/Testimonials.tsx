
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Emma Wilson',
    service: 'Plumbing Service',
    content: 'I had a leaking pipe that needed urgent attention. The plumber arrived within the hour and fixed it quickly. Excellent service and very professional!',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    id: 2,
    name: 'David Thompson',
    service: 'Electrical Repair',
    content: 'The electrician diagnosed and fixed our power issue in no time. Very knowledgeable and reasonable prices. I highly recommend this service.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: 3,
    name: 'Sophia Martinez',
    service: 'Home Cleaning',
    content: "I've been using their cleaning service for months now and my house has never looked better. The cleaners are thorough, punctual and very friendly.",
    rating: 4,
    image: 'https://randomuser.me/api/portraits/women/63.jpg',
  },
  {
    id: 4,
    name: 'Robert Jackson',
    service: 'Landscaping',
    content: 'Transformed my yard completely! The team was creative, hard-working and finished ahead of schedule. The result exceeded my expectations.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonialsToShow = 2;
  const maxIndex = testimonials.length - testimonialsToShow;
  
  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read about real experiences from satisfied customers who used our platform
          </p>
        </div>
        
        <div className="relative">
          <div className="flex flex-col md:flex-row gap-8">
            {testimonials.slice(activeIndex, activeIndex + testimonialsToShow).map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-lg shadow-md p-6 flex-1 transition-opacity duration-300"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.service}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <button 
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`p-2 rounded-full border border-gray-300 mr-4 ${
                activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={handleNext}
              disabled={activeIndex >= maxIndex}
              className={`p-2 rounded-full border border-gray-300 ${
                activeIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
