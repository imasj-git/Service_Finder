
import { useState, useEffect, useRef } from 'react';
import { Users, CheckCircle, Star, Clock } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 10000,
    label: 'Happy Customers',
    suffix: '+',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: CheckCircle,
    value: 25000,
    label: 'Jobs Completed',
    suffix: '+',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Star,
    value: 4.9,
    label: 'Average Rating',
    suffix: '',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: Clock,
    value: 2,
    label: 'Hour Response Time',
    suffix: 'h',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

const StatsSection = () => {
  const [visibleStats, setVisibleStats] = useState<number[]>([]);
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((_, index) => {
              setTimeout(() => {
                setVisibleStats(prev => [...prev, index]);
                animateValue(index, stats[index].value);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateValue = (index: number, endValue: number) => {
    const duration = 2000;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setAnimatedValues(prev => {
        const newValues = [...prev];
        newValues[index] = currentValue;
        return newValues;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return (
    <section ref={sectionRef} className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Customers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our growing community of satisfied customers who trust us with their home service needs
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 group ${
                visibleStats.includes(index) ? 'animate-fade-in scale-100' : 'scale-95 opacity-0'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={`${stat.bgColor} ${stat.color} w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                {Math.round(animatedValues[index] * 10) / 10}{stat.suffix}
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
