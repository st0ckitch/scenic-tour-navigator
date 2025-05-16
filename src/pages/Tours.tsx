
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTours } from '@/contexts/ToursContext';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { TourTranslation } from '@/types/tour';
import { Skeleton } from '@/components/ui/skeleton';

const ToursPage: React.FC = () => {
  const { tours, loading } = useTours();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { language } = useLanguage();
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});
  
  // Extract unique categories - with null check
  const categories = ['All', ...Array.from(new Set(tours.map(tour => tour.category || 'Uncategorized').filter(Boolean)))];
  
  // Filter tours based on search and category - with null checks
  const filteredTours = tours.filter(tour => {
    // First check if required properties exist
    const tourName = tour.translations?.[language]?.name || tour.name || '';
    const tourLocation = tour.translations?.[language]?.location || tour.location || '';
    const tourCategory = tour.category || 'Uncategorized';
    
    const matchesSearch = searchTerm === '' || 
                          tourName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tourLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tourCategory === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Set image loading state handler
  const handleImageLoad = (tourId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [tourId]: true }));
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, tourId: string) => {
    // Set the image as loaded (even though it errored) to remove the skeleton
    setImageLoadingStates(prev => ({ ...prev, [tourId]: true }));
    // Set a placeholder image
    event.currentTarget.src = '/placeholder.svg';
  };

  // Reset image loading states when tours change
  useEffect(() => {
    // Initialize all tour images as not loaded
    if (tours.length > 0) {
      const initialLoadingStates: Record<string, boolean> = {};
      tours.forEach(tour => {
        initialLoadingStates[tour.id] = false;
      });
      setImageLoadingStates(initialLoadingStates);
    }
  }, [tours]);

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
          
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-travel-sky" />
              <span className="ml-2">Loading tours...</span>
            </div>
          )}
          
          {!loading && filteredTours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tours matching your criteria</p>
              <Button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => {
                // Get the tour name and location from translations with proper fallbacks
                const tourName = tour.translations?.[language]?.name || tour.name || 'Unnamed Tour';
                const tourLocation = tour.translations?.[language]?.location || tour.location || 'Unknown location';
                const isImageLoaded = imageLoadingStates[tour.id] === true;
                
                return (
                  <Link to={`/tour/${tour.id}`} key={tour.id} className="group">
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="aspect-w-16 aspect-h-9 overflow-hidden relative">
                        {!isImageLoaded && (
                          <Skeleton className="absolute inset-0 w-full h-48" />
                        )}
                        <img 
                          src={tour.image || '/placeholder.svg'} 
                          alt={tourName} 
                          className={`h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300 ${!isImageLoaded ? 'invisible' : 'visible'}`}
                          onLoad={() => handleImageLoad(tour.id)}
                          onError={(e) => handleImageError(e, tour.id)}
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{tourName}</h3>
                            <p className="text-gray-600 text-sm">{tourLocation}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-400 line-through text-sm">${tour.originalPrice}</div>
                            <div className="text-travel-coral font-bold">${tour.discountPrice || tour.originalPrice}</div>
                          </div>
                        </div>
                        
                        {tour.dates && (
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm text-gray-600 flex items-center">
                              <CalendarIcon size={14} className="mr-1" /> 
                              {format(new Date(tour.dates.start), "MMM d")} - {format(new Date(tour.dates.end), "MMM d, yyyy")}
                            </div>
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">★</span>
                              <span className="font-medium">{tour.rating}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3">
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs">
                            {tour.category || 'Uncategorized'}
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
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ToursPage;
