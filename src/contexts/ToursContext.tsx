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

// Define metadata type for Supabase
type TourMetadata = {
  translations?: Record<Language, TourTranslation>;
}

// Define Supabase tour response type to explicitly include metadata
type SupabaseTourResponse = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string | null;
  rating: number;
  original_price: number;
  discount_price: number | null;
  category: string;
  participants: number | null;
  start_date: string;
  end_date: string;
  created_at: string;
  metadata: TourMetadata | null;
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
        console.log("Loading tours from Supabase...");
        
        const { data, error } = await supabase
          .from('tours')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        console.log("Tours data from Supabase:", data);
        
        // Transform Supabase data to Tour type
        const transformedTours: Tour[] = data.map((tour: SupabaseTourResponse) => {
          console.log("Processing tour:", tour.id, tour.name);
          
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
          
          // Check if metadata exists and has translations
          const translations = tour.metadata?.translations || defaultTranslations;
          console.log("Tour translations:", translations);
          
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
            translations
          };
        });
        
        console.log("Transformed tours:", transformedTours);
        setTours(transformedTours);
      } catch (error: any) {
        console.error('Failed to load tours:', error);
        toast({
          title: "Error",
          description: "Failed to load tours: " + error.message,
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
      console.log("Adding tour with data:", tour);
      
      // In a real app, we would upload the image to a storage service
      let imageUrl = tour.image;
      if (imageFile) {
        console.log("Processing image file:", imageFile.name);
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
      
      console.log('Sending tour data to Supabase:', supabaseTour);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('tours')
        .insert(supabaseTour)
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        const errorMsg = 'No data returned from Supabase after inserting tour';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('Tour created successfully, Supabase response:', data);
      
      const createdTour = data[0] as SupabaseTourResponse;
      
      // Create Tour object from response
      const newTour: Tour = {
        id: createdTour.id,
        name: createdTour.name,
        description: createdTour.description,
        location: createdTour.location,
        image: createdTour.image || '',
        rating: Number(createdTour.rating),
        originalPrice: Number(createdTour.original_price),
        discountPrice: createdTour.discount_price ? Number(createdTour.discount_price) : undefined,
        category: createdTour.category,
        participants: createdTour.participants || undefined,
        dates: {
          start: new Date(createdTour.start_date),
          end: new Date(createdTour.end_date)
        },
        translations: createdTour.metadata?.translations || {
          en: {
            name: createdTour.name,
            description: createdTour.description,
            location: createdTour.location,
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
      
      console.log("Tour added successfully:", newTour);
      
      return Promise.resolve(newTour);
    } catch (error: any) {
      console.error('Failed to add tour:', error);
      toast({
        title: "Error",
        description: "Failed to add tour: " + error.message,
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
      
      toast({
        title: "Success",
        description: "Tour updated successfully!",
      });
      
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
      
      toast({
        title: "Success",
        description: "Tour deleted successfully!",
      });
      
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
