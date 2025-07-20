
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-brand-600 mb-6">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            We couldn't find the page you're looking for. The page may have been moved or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button size="lg">
                Return to Home
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
