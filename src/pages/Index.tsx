
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import UnmissableExperienceSection from '@/components/UnmissableExperienceSection';
import DestinationsSection from '@/components/DestinationsSection';
import TourListingSection from '@/components/TourListingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <UnmissableExperienceSection />
      <DestinationsSection />
      <TourListingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
