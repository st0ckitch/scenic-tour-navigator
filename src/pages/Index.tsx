
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import TourListingSection from '@/components/TourListingSection';
import UnmissableExperienceSection from '@/components/UnmissableExperienceSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TestimonialsSection />
      <UnmissableExperienceSection />
      <TourListingSection />
      <Footer />
    </div>
  );
};

export default Index;
