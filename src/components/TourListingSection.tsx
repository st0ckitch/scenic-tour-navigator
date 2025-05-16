import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Tour, TourTranslation } from '@/types/tour';

type TourCardProps = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  rating: number;
  originalPrice: number;
  discountPrice?: number;
  dateRange: string;
};

const TourCard: React.FC<TourCardProps> = ({ 
  id, name, description, location, image, rating, originalPrice, discountPrice, dateRange 
}) => {
  return (
    <Link to={`/tour/${id}`} className="tour-card block group hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={image || 'https://via.placeholder.com/400x225?text=No+Image'}
          alt={name}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x225?text=No+Image';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-bold text-lg">{name}</h3>
            <p className="text-gray-600 text-sm">{location}</p>
          </div>
          <div className="text-right">
            {discountPrice ? (
              <>
                <div className="text-gray-400 line-through text-sm">${originalPrice}</div>
                <div className="text-travel-coral font-bold">${discountPrice}</div>
              </>
            ) : (
              <div className="text-travel-coral font-bold">${originalPrice}</div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
        
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
  const { language } = useLanguage();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Fetch tours from Supabase
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch all tours
        const { data: toursData, error: toursError } = await supabase
          .from('tours')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (toursError) {
          throw toursError;
        }
        
        // 2. Fetch all translations
        const { data: translationsData, error: translationsError } = await supabase
          .from('tour_translations')
          .select('*');
        
        if (translationsError) {
          throw translationsError;
        }
        
        // 3. Fetch all images
        const { data: imagesData, error: imagesError } = await supabase
          .from('tour_images')
          .select('*');
        
        if (imagesError) {
          console.error("Error fetching images:", imagesError);
          // Continue without images
        }
        
        // Organize translations by tour_id
        const translationsByTourId: Record<string, TourTranslation[]> = {};
        translationsData.forEach((translation) => {
          if (!translationsByTourId[translation.tour_id]) {
            translationsByTourId[translation.tour_id] = [];
          }
          translationsByTourId[translation.tour_id].push({
            name: translation.name,
            description: translation.description,
            longDescription: translation.longDescription || translation.description,
            location: translation.location,
            language: translation.language as Language
          });
        });
        
        // Organize images by tour_id
        const imagesByTourId: Record<string, any[]> = {};
        if (imagesData && imagesData.length > 0) {
          imagesData.forEach((image) => {
            if (!imagesByTourId[image.tour_id]) {
              imagesByTourId[image.tour_id] = [];
            }
            imagesByTourId[image.tour_id].push({
              id: image.id,
              url: image.url,
              isMain: image.is_main
            });
          });
        }
        
        // 4. Combine tours, translations, and images
        const formattedTours = toursData.map((tour): Tour => {
          // Default translations
          const defaultTranslations: Record<Language, TourTranslation> = {
            en: {
              name: "Untitled Tour", 
              description: "No description", 
              longDescription: "No detailed description available",
              location: "Unknown location",
              language: "en"
            },
            ka: {
              name: "Untitled Tour", 
              description: "No description", 
              longDescription: "No detailed description available",
              location: "Unknown location",
              language: "ka"
            },
            ru: {
              name: "Untitled Tour", 
              description: "No description", 
              longDescription: "No detailed description available",
              location: "Unknown location",
              language: "ru"
            }
          };
          
          // If we have translations for this tour, use them
          const tourTranslations = translationsByTourId[tour.id] || [];
          if (tourTranslations.length > 0) {
            tourTranslations.forEach((translation) => {
              defaultTranslations[translation.language] = translation;
            });
          }
          
          // Get images for this tour
          const tourImages = imagesByTourId[tour.id] || [];
          
          // Find main image
          let mainImage = tour.image;
          const mainImageObj = tourImages.find(img => img.isMain);
          if (mainImageObj) {
            mainImage = mainImageObj.url;
          }
          
          return {
            id: tour.id,
            category: tour.category,
            originalPrice: Number(tour.original_price),
            discountPrice: tour.discount_price ? Number(tour.discount_price) : undefined,
            participants: tour.participants || undefined,
            rating: Number(tour.rating),
            image: mainImage || undefined,
            images: tourImages,
            dates: {
              start: new Date(tour.start_date),
              end: new Date(tour.end_date)
            },
            translations: defaultTranslations
          };
        });
        
        setTours(formattedTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTours();
  }, []);
  
  // Apply localization to tours based on current language
  const localizedTours = tours.map(tour => {
    const translation = tour.translations[language] || tour.translations.en;
    return {
      ...tour,
      translations: tour.translations,
      name: translation.name,
      description: translation.description,
      longDescription: translation.longDescription,
      location: translation.location
    };
  });
  
  // Get unique categories from the tours
  const availableFilters = Array.from(new Set(tours.map(tour => tour.category)));
  // Include 'All' as the first filter
  const filters = ['All', ...availableFilters.filter(f => f !== 'All')];
  
  // Filter tours based on active filter
  const filteredTours = activeFilter === 'All' 
    ? localizedTours 
    : localizedTours.filter(tour => tour.category === activeFilter);
  
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
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-travel-sky" />
            <span className="ml-2">Loading tours...</span>
          </div>
        )}
        
        {/* Tour Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTours.length > 0 ? (
              displayedTours.map((tour) => (
                <TourCard 
                  key={tour.id} 
                  id={tour.id}
                  name={tour.translations[language]?.name || tour.translations.en.name}
                  description={tour.translations[language]?.description || tour.translations.en.description}
                  location={tour.translations[language]?.location || tour.translations.en.location}
                  image={tour.image || 'https://via.placeholder.com/400x225?text=No+Image'}
                  rating={tour.rating}
                  originalPrice={tour.originalPrice}
                  discountPrice={tour.discountPrice}
                  dateRange={`${format(tour.dates.start, "MMM d")} - ${format(tour.dates.end, "MMM d, yyyy")}`}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No tours available. Please check back later.</p>
              </div>
            )}
          </div>
        )}
        
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
