
import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Kuta Beach In Lombok Stole My Heart
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto">
          The Serenity Of The Waves, The Golden Sands, And The Warm Sun Made Every Moment 
          Magical. A Must-Visit For Anyone Seeking Paradise On Earth!
        </p>
      </div>
      
      <div className="mt-10 flex flex-wrap justify-center items-center gap-2">
        <div className="flex -space-x-4">
          <img 
            className="w-10 h-10 rounded-full border-2 border-white" 
            src="https://randomuser.me/api/portraits/women/21.jpg" 
            alt="User" 
          />
          <img 
            className="w-10 h-10 rounded-full border-2 border-white" 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="User" 
          />
          <img 
            className="w-10 h-10 rounded-full border-2 border-white" 
            src="https://randomuser.me/api/portraits/women/45.jpg" 
            alt="User" 
          />
          <img 
            className="w-10 h-10 rounded-full border-2 border-white" 
            src="https://randomuser.me/api/portraits/men/57.jpg" 
            alt="User" 
          />
        </div>
        <p className="font-medium ml-2">
          150K happy guests
        </p>
      </div>
    </section>
  );
};

export default TestimonialsSection;
