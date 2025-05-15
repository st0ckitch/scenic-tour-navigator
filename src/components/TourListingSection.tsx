
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TourCardProps = {
  name: string;
  location: string;
  image: string;
  rating: number;
  originalPrice: number;
  discountPrice: number;
  dateRange: string;
};

const TourCard: React.FC<TourCardProps> = ({ 
  name, location, image, rating, originalPrice, discountPrice, dateRange 
}) => {
  return (
    <div className="tour-card animate-fade-in">
      <div className="relative overflow-hidden">
        <img 
          src={image}
          alt={name}
          className="tour-image group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-bold text-lg">{name}</h3>
            <p className="text-gray-600 text-sm">{location}</p>
          </div>
          <div className="text-right">
            <div className="text-gray-400 line-through text-sm">${originalPrice}</div>
            <div className="text-travel-coral font-bold">${discountPrice}</div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600 flex items-center">
            <CalendarIcon size={14} className="mr-1" /> {dateRange}
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="font-medium">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ name: string; active: boolean; onClick: () => void }> = ({ 
  name, active, onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-full text-sm transition-colors ${
        active 
          ? 'bg-gray-800 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {name}
    </button>
  );
};

const TourListingSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Featured');
  
  const filters = ['Featured', 'Family-friendly', 'On sale', 'Sub nav'];
  
  const tours = [
    {
      name: "The Grand Resort",
      location: "East Barrett",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      originalPrice: 499,
      discountPrice: 288,
      dateRange: "Tue, Jul 20 - Fri, Jul 23",
    },
    {
      name: "The Grand Resort",
      location: "Steuberbury",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      originalPrice: 355,
      discountPrice: 287,
      dateRange: "Tue, Jul 20 - Fri, Jul 23",
    },
    {
      name: "The Grand Resort",
      location: "Idaview",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      originalPrice: 355,
      discountPrice: 288,
      dateRange: "Tue, Jul 20 - Fri, Jul 23",
    },
    {
      name: "The Grand Resort",
      location: "Yasminturt",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      originalPrice: 355,
      discountPrice: 267,
      dateRange: "Tue, Jul 20 - Fri, Jul 23",
    },
    {
      name: "The Grand Resort",
      location: "North Edenshire",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      originalPrice: 499,
      discountPrice: 288,
      dateRange: "Tue, Jul 20 - Fri, Jul 23",
    },
    {
      name: "The Grand Resort",
      location: "West Gregoria",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      originalPrice: 399,
      discountPrice: 267,
      dateRange: "Tue, Jul 20 - Fri, Jul 23",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Go somewhere</h2>
        <p className="text-xl text-gray-600 mb-10">Let's go on an adventure</p>
        
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              name={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
          
          <div className="ml-auto">
            <select className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>Recently added</option>
              <option>Price: Low to high</option>
              <option>Price: High to low</option>
              <option>Top rated</option>
            </select>
          </div>
        </div>
        
        {/* Tour Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour, index) => (
            <TourCard key={index} {...tour} />
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button className="bg-travel-coral text-white hover:bg-orange-600 px-8 py-2">
            View All Tours
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TourListingSection;
