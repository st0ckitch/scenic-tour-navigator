
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTours } from '@/contexts/ToursContext';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const ToursPage: React.FC = () => {
  const { tours } = useTours();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(tours.map(tour => tour.category)))];
  
  // Filter tours based on search and category
  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tour.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Explore All Tours</h1>
          <p className="text-xl text-gray-600 mb-8">Find your perfect adventure</p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Search bar */}
            <div className="flex-grow max-w-md">
              <Input
                type="text"
                placeholder="Search tours or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {filteredTours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tours matching your criteria</p>
              <Button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Link to={`/tour/${tour.id}`} key={tour.id} className="group">
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img 
                        src={tour.image} 
                        alt={tour.name} 
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{tour.name}</h3>
                          <p className="text-gray-600 text-sm">{tour.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400 line-through text-sm">${tour.originalPrice}</div>
                          <div className="text-travel-coral font-bold">${tour.discountPrice || tour.originalPrice}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-gray-600 flex items-center">
                          <CalendarIcon size={14} className="mr-1" /> 
                          {format(tour.dates.start, "MMM d")} - {format(tour.dates.end, "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="font-medium">{tour.rating}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs">
                          {tour.category}
                        </span>
                        {tour.participants && (
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs ml-2">
                            Max {tour.participants} guests
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ToursPage;
