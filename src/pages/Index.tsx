
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import UnmissableExperienceSection from '@/components/UnmissableExperienceSection';
import TourListingSection from '@/components/TourListingSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <UnmissableExperienceSection />
      <TourListingSection />
      <Footer />
    </div>
  );
};

export default Index;
