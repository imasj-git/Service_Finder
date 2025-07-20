
import HeroSection from '@/components/home/HeroSection';
import ServiceCategories from '@/components/home/ServiceCategories';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedProviders from '@/components/home/FeaturedProviders';
import Testimonials from '@/components/home/Testimonials';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatsSection from '@/components/home/StatsSection';
import TrustBadges from '@/components/home/TrustBadges';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 via-white to-purple-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section - Full viewport height on larger screens */}
        <section className="min-h-[80vh] md:min-h-[90vh] flex items-center theme-gradient-primary">
          <HeroSection />
        </section>
        
        {/* Trust Badges - Compact spacing */}
        <section className="py-8 md:py-12 bg-white">
          <TrustBadges />
        </section>
        
        {/* Service Categories - No extra container */}
        <ServiceCategories />
        
        {/* Stats Section - No extra container */}
        <StatsSection />
        
        {/* How It Works - No extra container */}
        <HowItWorks />
        
        {/* Featured Providers - No extra container */}
        <FeaturedProviders />
        
        {/* Testimonials - No extra container */}
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
