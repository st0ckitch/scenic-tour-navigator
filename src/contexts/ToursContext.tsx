
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { supabase } from "@/integrations/supabase/client";

// Define tour dates type
type TourDates = {
  start: Date;
  end: Date;
};

// Define tour translation type
type TourTranslation = {
  name: string;
  description: string;
  location: string;
  language: Language;
};

// Define tour type
export type Tour = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  rating: number;
  originalPrice: number;
  discountPrice?: number;
  category: string;
  participants?: number;
  dates: TourDates;
  translations?: Record<Language, TourTranslation>;
};

// Define context type
type ToursContextType = {
  tours: Tour[];
  loading: boolean;
  addTour: (tour: Omit<Tour, 'id'>, imageFile?: File) => Promise<void>;
  updateTour: (tour: Tour, imageFile?: File) => Promise<void>;
  deleteTour: (id: string) => Promise<void>;
};

// Create the context
const ToursContext = createContext<ToursContextType | undefined>(undefined);

// Provider component
export const ToursProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  // Load tours from Supabase
  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('tours')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Transform Supabase data to Tour type
        const transformedTours: Tour[] = data.map(tour => {
          // Create default translations object
          const defaultTranslations: Record<Language, TourTranslation> = {
            en: {
              name: tour.name,
              description: tour.description,
              location: tour.location,
              language: 'en'
            },
            ka: {
              name: tour.name,
              description: tour.description,
              location: tour.location,
              language: 'ka'
            },
            ru: {
              name: tour.name,
              description: tour.description,
              location: tour.location,
              language: 'ru'
            }
          };
          
          return {
            id: tour.id,
            name: tour.name,
            description: tour.description,
            location: tour.location,
            image: tour.image || '',
            rating: Number(tour.rating),
            originalPrice: Number(tour.original_price),
            discountPrice: tour.discount_price ? Number(tour.discount_price) : undefined,
            category: tour.category,
            participants: tour.participants || undefined,
            dates: {
              start: new Date(tour.start_date),
              end: new Date(tour.end_date)
            },
            translations: defaultTranslations
          };
        });
        
        setTours(transformedTours);
      } catch (error) {
        console.error('Failed to load tours:', error);
        toast({
          title: "Error",
          description: "Failed to load tours. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  // Function to localize tour data based on current language
  const localizedTours = tours.map(tour => {
    if (tour.translations && tour.translations[language]) {
      return {
        ...tour,
        name: tour.translations[language].name || tour.name,
        description: tour.translations[language].description || tour.description,
        location: tour.translations[language].location || tour.location,
      };
    }
    return tour;
  });

  // Add a new tour to Supabase
  const addTour = async (tour: Omit<Tour, 'id'>, imageFile?: File) => {
    try {
      setLoading(true);
      
      // In a real app, we would upload the image to a storage service
      let imageUrl = tour.image;
      if (imageFile) {
        // This is just a placeholder URL for demo purposes
        imageUrl = URL.createObjectURL(imageFile);
      }
      
      // Format data for Supabase
      const supabaseTour = {
        name: tour.name,
        description: tour.description,
        location: tour.location,
        image: imageUrl,
        rating: tour.rating,
        original_price: tour.originalPrice,
        discount_price: tour.discountPrice,
        category: tour.category,
        participants: tour.participants,
        start_date: tour.dates.start.toISOString(),
        end_date: tour.dates.end.toISOString(),
        // Store translations as a JSON field in metadata
        metadata: {
          translations: tour.translations || {
            en: {
              name: tour.name,
              description: tour.description,
              location: tour.location,
              language: 'en'
            },
            ka: {
              name: '',
              description: '',
              location: '',
              language: 'ka'
            },
            ru: {
              name: '',
              description: '',
              location: '',
              language: 'ru'
            }
          }
        }
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('tours')
        .insert(supabaseTour)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Create Tour object from response
      const newTour: Tour = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
        location: data[0].location,
        image: data[0].image || '',
        rating: Number(data[0].rating),
        originalPrice: Number(data[0].original_price),
        discountPrice: data[0].discount_price ? Number(data[0].discount_price) : undefined,
        category: data[0].category,
        participants: data[0].participants || undefined,
        dates: {
          start: new Date(data[0].start_date),
          end: new Date(data[0].end_date)
        },
        translations: data[0].metadata?.translations || {
          en: {
            name: data[0].name,
            description: data[0].description,
            location: data[0].location,
            language: 'en'
          },
          ka: {
            name: '',
            description: '',
            location: '',
            language: 'ka'
          },
          ru: {
            name: '',
            description: '',
            location: '',
            language: 'ru'
          }
        }
      };
      
      // Update local state
      setTours(prevTours => [...prevTours, newTour]);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add tour:', error);
      toast({
        title: "Error",
        description: "Failed to add tour. Please try again later.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing tour in Supabase
  const updateTour = async (updatedTour: Tour, imageFile?: File) => {
    try {
      setLoading(true);
      
      // In a real app, we would upload the image to a storage service
      let imageUrl = updatedTour.image;
      if (imageFile) {
        // This is just a placeholder URL for demo purposes
        imageUrl = URL.createObjectURL(imageFile);
      }
      
      // Format data for Supabase
      const supabaseTour = {
        name: updatedTour.name,
        description: updatedTour.description,
        location: updatedTour.location,
        image: imageUrl,
        rating: updatedTour.rating,
        original_price: updatedTour.originalPrice,
        discount_price: updatedTour.discountPrice,
        category: updatedTour.category,
        participants: updatedTour.participants,
        start_date: updatedTour.dates.start.toISOString(),
        end_date: updatedTour.dates.end.toISOString(),
        // Store translations as a JSON field in metadata
        metadata: {
          translations: updatedTour.translations || {
            en: {
              name: updatedTour.name,
              description: updatedTour.description,
              location: updatedTour.location,
              language: 'en'
            },
            ka: {
              name: '',
              description: '',
              location: '',
              language: 'ka'
            },
            ru: {
              name: '',
              description: '',
              location: '',
              language: 'ru'
            }
          }
        }
      };
      
      // Update in Supabase
      const { error } = await supabase
        .from('tours')
        .update(supabaseTour)
        .eq('id', updatedTour.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTours(prevTours => 
        prevTours.map(tour => 
          tour.id === updatedTour.id 
            ? { ...updatedTour, image: imageFile ? imageUrl : tour.image } 
            : tour
        )
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update tour:', error);
      toast({
        title: "Error",
        description: "Failed to update tour. Please try again later.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a tour from Supabase
  const deleteTour = async (id: string) => {
    try {
      setLoading(true);
      
      // Delete from Supabase
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTours(prevTours => prevTours.filter(tour => tour.id !== id));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to delete tour:', error);
      toast({
        title: "Error",
        description: "Failed to delete tour. Please try again later.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToursContext.Provider value={{ 
      tours: localizedTours, 
      loading, 
      addTour, 
      updateTour, 
      deleteTour 
    }}>
      {children}
    </ToursContext.Provider>
  );
};

// Custom hook to use the tours context
export const useTours = () => {
  const context = useContext(ToursContext);
  if (context === undefined) {
    throw new Error('useTours must be used within a ToursProvider');
  }
  return context;
};
