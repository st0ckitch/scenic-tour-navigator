
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TourListingSection from '@/components/TourListingSection';
import DestinationsSection from '@/components/DestinationsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TourListingSection />
      <DestinationsSection />
      <Footer />
    </div>
  );
};

export default Index;
