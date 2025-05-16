
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tour, TourTranslation } from '@/types/tour';
import { Language } from '@/contexts/LanguageContext';
import { toast } from "@/components/ui/use-toast";

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
      
      // 3. Organize translations by tour_id
      const translationsByTourId: Record<string, TourTranslation[]> = {};
      translationsData.forEach((translation) => {
        if (!translationsByTourId[translation.tour_id]) {
          translationsByTourId[translation.tour_id] = [];
        }
        translationsByTourId[translation.tour_id].push({
          name: translation.name,
          description: translation.description,
          location: translation.location,
          language: translation.language as Language
        });
      });
      
      // 4. Combine tours and translations
      const formattedTours = toursData.map((tour): Tour => {
        // Default translations if we don't have any
        const defaultTranslations: Record<Language, TourTranslation> = {
          en: {
            name: "Untitled Tour", 
            description: "No description", 
            location: "Unknown location",
            language: "en"
          },
          ka: {
            name: "Untitled Tour", 
            description: "No description", 
            location: "Unknown location",
            language: "ka"
          },
          ru: {
            name: "Untitled Tour", 
            description: "No description", 
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
        
        return {
          id: tour.id,
          category: tour.category,
          originalPrice: Number(tour.original_price),
          discountPrice: tour.discount_price ? Number(tour.discount_price) : undefined,
          participants: tour.participants || undefined,
          rating: Number(tour.rating),
          image: tour.image || undefined,
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
