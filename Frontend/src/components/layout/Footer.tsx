import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

const Footer = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : 'http://localhost:5000/api/v1/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data || []);
      });
  }, []);

  const handleServicesClick = () => {
    navigate('/services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-brand-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-brand-200">LocalHeroes</h3>
            <p className="text-gray-300 mb-4">
              Connecting you with trusted local service professionals for all your home needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-300 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-200">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-brand-300 transition-colors">Home</Link>
              </li>
              <li>
                <button 
                  onClick={handleServicesClick}
                  className="text-gray-300 hover:text-brand-300 transition-colors bg-transparent border-none cursor-pointer text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-brand-300 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-brand-300 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-200">Services</h3>
            <ul className="space-y-2">
              {categories.length === 0 ? (
                <li className="text-gray-400">Loading...</li>
              ) : (
                categories.map(category => (
                  <li key={category._id}>
                    <Link to={`/services?category=${category._id}`} className="text-gray-300 hover:text-brand-300 transition-colors">{category.name}</Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-200">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="text-gray-400 mr-2 mt-1" />
                <span className="text-gray-300">123 Service Street, Home City, HC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-gray-400 mr-2" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-gray-400 mr-2" />
                <span className="text-gray-300">info@localheroes.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LocalHeroes. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-brand-300 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-brand-300 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
