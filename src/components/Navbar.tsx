
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

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

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('tours'), path: '/tours' },
    { name: t('destinations'), path: '#' },
    { name: t('reviews'), path: '#' },
    { name: t('blog'), path: '#' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold font-heading">
          <Link to="/" className={`${scrolled ? 'text-blue-600' : 'text-black font-extrabold'} text-shadow`}>
            Geosides
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`font-medium hover:text-travel-coral transition-colors text-black`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side - only language selector */}
        <div className="hidden md:flex items-center">
          <LanguageSelector />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSelector />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${scrolled ? 'text-gray-700' : 'text-black'}`}
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
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="font-medium text-gray-700 hover:text-travel-coral"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
