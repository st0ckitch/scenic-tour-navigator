
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold font-heading">
          <a href="/" className={`${scrolled ? 'text-blue-600' : 'text-white'}`}>
            Geosides
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {['Home', 'About Us', 'Destinations', 'Reviews', 'Blog'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className={`font-medium hover:text-travel-coral transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <div className={`${scrolled ? 'text-gray-700' : 'text-white'} font-medium`}>EN</div>
          <Button variant="outline" 
            className={`${scrolled ? 'border-gray-300 text-gray-700' : 'border-white text-white'}`}>
            Login
          </Button>
          <Button className="bg-travel-coral text-white hover:bg-orange-600">Register</Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white absolute left-0 w-full px-4 py-2 shadow-md transition-all duration-300 ${
        mobileMenuOpen ? 'top-16 opacity-100' : 'top-[-400px] opacity-0'
      }`}>
        <nav className="flex flex-col space-y-3 py-2">
          {['Home', 'About Us', 'Destinations', 'Reviews', 'Blog'].map((item) => (
            <a key={item} href="#" className="font-medium text-gray-700 hover:text-travel-coral">
              {item}
            </a>
          ))}
          <div className="pt-2 flex flex-col space-y-2">
            <Button variant="outline" className="w-full">Login</Button>
            <Button className="w-full bg-travel-coral text-white hover:bg-orange-600">Register</Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
