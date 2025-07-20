import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Mock authentication state - this would be replaced by real auth state
  const isAuthenticated = false;

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show success message
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <>
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account and redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                setShowLogoutDialog(false);
                handleLogout();
              }}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-brand-600 font-bold text-2xl">LocalHeroes</span>
              </Link>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-600">
                Home
              </Link>
              <Link to="/services" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-600">
                Services
              </Link>
              <Link to="/providers" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-600">
                Providers
              </Link>
              <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-600">
                About
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-600">
                Contact
              </Link>
            </div>
            
            <div className="hidden md:flex items-center">
              {localStorage.getItem('token') ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <AccountCircleIcon />
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-bookings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>My Bookings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowLogoutDialog(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="default" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-in-right">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/providers" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Providers
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 flex flex-col space-y-2">
                {localStorage.getItem('token') ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600">
                      <Settings className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>
                    <button 
                      onClick={() => setShowLogoutDialog(true)}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="default" size="sm" className="w-full justify-start">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
