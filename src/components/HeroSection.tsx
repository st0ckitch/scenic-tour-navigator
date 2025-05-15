
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

const HeroSection: React.FC = () => {
  const [searchType, setSearchType] = useState<'hotel' | 'destination'>('hotel');
  
  return (
    <div className="relative h-screen">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-center">
          Welcome to Lombok
        </h1>
        <p className="text-xl md:text-2xl font-light mb-12 text-center">
          Adventure and Tranquility
        </p>
        
        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 text-gray-800">
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4 mb-2">
              <h2 className="text-xl font-bold">Discover Hotels</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">City or Hotel Name</label>
                <Input placeholder="Search location or hotel" className="w-full" />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Hotel Name</label>
                <Input placeholder="Hotel name (optional)" className="w-full" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Check-In</label>
                <div className="relative">
                  <Input type="date" placeholder="Select date" className="w-full pl-10" />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Duration</label>
                <Input type="number" placeholder="Number of nights" className="w-full" min="1" defaultValue="1" />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Guests And Rooms</label>
              <Input placeholder="2 Adults, 0 Children, 1 Room" className="w-full" />
            </div>
            
            <Button className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md transition-colors">
              Search Hotel
            </Button>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
        {['LANDSCAPE', 'EXCURSION', 'JOURNEY', 'EXCITING', 'TRAVEL', 'BEACH'].map((tag) => (
          <span 
            key={tag} 
            className="tag bg-travel-sky px-4 py-1 rounded-full text-white text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
