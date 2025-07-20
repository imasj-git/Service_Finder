
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building strong communities by connecting neighbors with trusted local professionals.',
    },
    {
      icon: Target,
      title: 'Quality Focus',
      description: 'Every service provider on our platform is thoroughly vetted to ensure exceptional service quality.',
    },
    {
      icon: Award,
      title: 'Excellence Driven',
      description: 'We continuously strive for excellence in everything we do, from our platform to customer service.',
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure a positive experience.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '2,500+', label: 'Service Providers' },
    { number: '50+', label: 'Service Categories' },
    { number: '4.9/5', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 via-white to-purple-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="theme-gradient-primary py-20 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                About Local Heroes
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
                Connecting communities with trusted professionals since 2020. 
                We're passionate about making home services simple, reliable, and accessible.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  We're on a mission to revolutionize how homeowners connect with service professionals. 
                  By providing a transparent, reliable platform, we make it easy to find trusted experts 
                  for any home service need.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  From emergency repairs to home improvements, we ensure every interaction is backed 
                  by quality, trust, and exceptional customer service.
                </p>
              </div>
              <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Verified and background-checked professionals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>24/7 customer support and satisfaction guarantee</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Easy booking and secure payment processing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 theme-gradient-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Impact
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Numbers that showcase our commitment to connecting communities
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-brand-100">
                  <div className="text-3xl md:text-4xl font-bold text-brand-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 theme-gradient-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're a passionate team of professionals dedicated to making home services 
              accessible and reliable for everyone.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <span className="text-lg font-semibold">Ready to join our mission?</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
