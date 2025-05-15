
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTours } from '@/contexts/ToursContext';
import { Link } from 'react-router-dom';

type TourCardProps = {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  originalPrice: number;
  discountPrice?: number;
  dateRange: string;
};

const TourCard: React.FC<TourCardProps> = ({ 
  id, name, location, image, rating, originalPrice, discountPrice, dateRange 
}) => {
  return (
    <Link to={`/tour/${id}`} className="tour-card animate-fade-in block">
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
            <div className="text-travel-coral font-bold">${discountPrice || originalPrice}</div>
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
    </Link>
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
  const { tours } = useTours();
  const [activeFilter, setActiveFilter] = useState('Featured');
  
  // Get unique categories from the tours
  const availableFilters = Array.from(new Set(tours.map(tour => tour.category)));
  // Ensure 'Featured' is always included
  const filters = ['Featured', ...availableFilters.filter(f => f !== 'Featured')];
  
  // Filter tours based on active filter
  const filteredTours = activeFilter 
    ? tours.filter(tour => tour.category === activeFilter)
    : tours;
  
  // Limit to 6 tours for display
  const displayedTours = filteredTours.slice(0, 6);

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
          {displayedTours.map((tour) => (
            <TourCard 
              key={tour.id} 
              id={tour.id}
              name={tour.name} 
              location={tour.location}
              image={tour.image}
              rating={tour.rating}
              originalPrice={tour.originalPrice}
              discountPrice={tour.discountPrice}
              dateRange={`${format(tour.dates.start, "MMM d")} - ${format(tour.dates.end, "MMM d, yyyy")}`}
            />
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link to="/tours">
            <Button className="bg-travel-coral text-white hover:bg-orange-600 px-8 py-2">
              View All Tours
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TourListingSection;
