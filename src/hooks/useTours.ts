
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tour, TourTranslation } from '@/types/tour';
import { Language } from '@/contexts/LanguageContext';
import { toast } from "@/components/ui/use-toast";
import { TourImage } from './useTourOperations';

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch all tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      console.log("Fetching tours...");
      
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
      
      // 3. Fetch all tour images
      const { data: imagesData, error: imagesError } = await supabase
        .from('tour_images')
        .select('*');
      
      if (imagesError) {
        console.error("Error fetching images:", imagesError);
        // Continue without images
      }
      
      // 3. Organize translations by tour_id
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
      const imagesByTourId: Record<string, TourImage[]> = {};
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
      
      console.log(`Fetched ${formattedTours.length} tours`);
      setTours(formattedTours);
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast({
        title: "Error",
        description: "Failed to load tours. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch tours on mount
  useEffect(() => {
    fetchTours();
  }, []);

  return {
    tours,
    loading,
    refetch: fetchTours
  };
}
