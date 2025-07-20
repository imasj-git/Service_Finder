
import { Shield, Award, Clock, Users } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    text: 'Verified Professionals',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Award,
    text: 'Quality Guaranteed',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Clock,
    text: '24/7 Support',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Users,
    text: 'Trusted by 10K+',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const TrustBadges = () => {
  return (
    <section className="bg-gradient-to-r from-gray-50 via-white to-blue-50 border-y border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 md:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/40 hover:bg-white hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`h-10 w-10 md:h-12 md:w-12 ${badge.color} ${badge.bgColor} rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <badge.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-700 leading-tight">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
