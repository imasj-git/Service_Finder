import { useState, useEffect, useRef } from 'react';
import { Users, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : 'http://localhost:5000/api/v1/categories'}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Failed to fetch categories');
        setCategories(data.data || []);
      })
      .catch(err => setError(err.message || 'Error fetching categories'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );
    const serviceCards = containerRef.current?.querySelectorAll('.service-card');
    serviceCards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-none">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
            ⚡ Professional Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Our Premium Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover top-rated professionals ready to transform your home with expert services
          </p>
        </div>
        {loading ? (
          <div className="text-center py-12">Loading categories...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                to={`/services?category=${category._id}`}
                className={`service-card group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 ${
                  visibleItems.includes(index)
                    ? 'animate-fade-in opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-full'
                }`}
                data-index={index}
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: visibleItems.includes(index) ? 'translateX(0)' : 'translateX(-100%)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {category.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Popular
                  </div>
                )}
               <div className="p-6 lg:p-8">
  <div className="inline-flex items-center justify-center h-16 w-16 lg:h-20 lg:w-20 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative overflow-hidden">
    {category.image && (
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover rounded-2xl"
      />
    )}
  </div>
  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
    {category.name}
  </h3>
  <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
    {category.description}
  </p>
  <div className="space-y-3 mb-6">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center text-gray-500">
        <Users className="h-4 w-4 mr-2" />
        <span>{category.providersCount || '—'}</span>
      </div>
      <div className="flex items-center text-gray-500">
        <Clock className="h-4 w-4 mr-2" />
        <span>{category.avgTime || '—'}</span>
      </div>
    </div>
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(category.rating || 0)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="ml-2 text-sm font-medium text-gray-700">
        {category.rating || '—'}
      </span>
    </div>
  </div>
  <div className="flex items-center justify-between">
    <span className="text-brand-600 font-semibold text-base group-hover:text-brand-700 transition-colors">
      Find Pros
    </span>
    <svg
      className="ml-2 w-5 h-5 text-brand-600 group-hover:translate-x-1 transition-transform duration-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </div>
</div>

                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-brand-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All Services
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
