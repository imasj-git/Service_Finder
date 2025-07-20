
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How do I book a service provider?",
      answer: "Simply browse our services, select a provider, and click 'Book Now'. You can choose your preferred date and time, and the provider will confirm your appointment."
    },
    {
      question: "Are all service providers verified?",
      answer: "Yes, all our service providers go through a comprehensive verification process including background checks, license verification, and insurance confirmation."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a satisfaction guarantee. If you're not happy with the service, contact us within 24 hours and we'll work to resolve the issue or provide a refund."
    },
    {
      question: "How do I become a service provider?",
      answer: "Click on 'Become a Provider' in our navigation menu. You'll need to complete our application, provide necessary documentation, and pass our verification process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods. Payment is processed securely through our platform."
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer: "Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled service time without any penalty."
    },
    {
      question: "How are service providers rated?",
      answer: "Service providers are rated by customers based on quality of work, professionalism, punctuality, and overall satisfaction on a 5-star scale."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve major metropolitan areas and are expanding rapidly. Check our service area page or enter your zip code to see if we serve your location."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl opacity-90">
              Find answers to common questions about our services
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-brand-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-brand-600 flex-shrink-0" />
                    )}
                  </button>
                  {openItems.includes(index) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-brand-50 to-purple-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Still have questions?
                </h2>
                <p className="text-gray-600 mb-6">
                  Our support team is here to help you with any additional questions.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-lg hover:from-brand-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
