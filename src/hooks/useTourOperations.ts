
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Language } from '@/contexts/LanguageContext';
import { Tour, NewTour, TourTranslation } from '@/types/tour';

export function useTourOperations() {
  const [loading, setLoading] = useState(false);

  // Create a new tour
  const createTour = async (newTour: NewTour, imageFile?: File): Promise<Tour | null> => {
    try {
      setLoading(true);
      console.log("Creating tour with data:", JSON.stringify(newTour, null, 2));
      
      // Handle image upload if provided
      let imageUrl = newTour.image;
      
      // In a real app, upload image to Supabase storage
      if (imageFile) {
        // This is just a placeholder for demo
        imageUrl = URL.createObjectURL(imageFile);
      }
      
      // Insert tour into database
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .insert({
          category: newTour.category,
          original_price: newTour.originalPrice,
          discount_price: newTour.discountPrice,
          participants: newTour.participants,
          rating: newTour.rating,
          image: imageUrl,
          start_date: newTour.dates.start.toISOString(),
          end_date: newTour.dates.end.toISOString()
        })
        .select()
        .single();
      
      if (tourError) {
        console.error("Error creating tour:", tourError);
        throw new Error(`Failed to create tour: ${tourError.message}`);
      }
      
      if (!tourData) {
        throw new Error("No data returned after creating tour");
      }
      
      const tourId = tourData.id;
      console.log("Tour created with ID:", tourId);
      
      // Insert translations
      const translationPromises = Object.entries(newTour.translations).map(
        async ([lang, translation]) => {
          const language = lang as Language;
          const { error: translationError } = await supabase
            .from('tour_translations')
            .insert({
              tour_id: tourId,
              language,
              name: translation.name,
              description: translation.description,
              location: translation.location
            });
          
          if (translationError) {
            console.error(`Error creating ${language} translation:`, translationError);
            throw new Error(`Failed to create ${language} translation: ${translationError.message}`);
          }
          
          return { ...translation, language };
        }
      );
      
      await Promise.all(translationPromises);
      console.log("All translations created successfully");
      
      // Construct the complete tour object
      const createdTour: Tour = {
        id: tourId,
        category: newTour.category,
        originalPrice: newTour.originalPrice,
        discountPrice: newTour.discountPrice,
        participants: newTour.participants,
        rating: newTour.rating,
        image: imageUrl,
        dates: newTour.dates,
        translations: newTour.translations
      };
      
      toast({
        title: "Tour Created",
        description: `Tour ${newTour.translations.en.name} has been created successfully.`
      });
      
      return createdTour;
    } catch (error) {
      console.error("Error in createTour:", error);
      toast({
        title: "Error Creating Tour",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing tour
  const updateTour = async (tour: Tour, imageFile?: File): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("Updating tour:", JSON.stringify(tour, null, 2));
      
      // Handle image update if needed
      let imageUrl = tour.image;
      if (imageFile) {
        // This is just a placeholder for demo
        imageUrl = URL.createObjectURL(imageFile);
      }
      
      // Update tour in database
      const { error: tourError } = await supabase
        .from('tours')
        .update({
          category: tour.category,
          original_price: tour.originalPrice,
          discount_price: tour.discountPrice,
          participants: tour.participants,
          image: imageUrl,
          start_date: tour.dates.start.toISOString(),
          end_date: tour.dates.end.toISOString()
        })
        .eq('id', tour.id);
      
      if (tourError) {
        console.error("Error updating tour:", tourError);
        throw new Error(`Failed to update tour: ${tourError.message}`);
      }
      
      // Update translations - first delete existing translations
      const { error: deleteError } = await supabase
        .from('tour_translations')
        .delete()
        .eq('tour_id', tour.id);
      
      if (deleteError) {
        console.error("Error deleting existing translations:", deleteError);
        throw new Error(`Failed to update translations: ${deleteError.message}`);
      }
      
      // Insert new translations
      const translationPromises = Object.entries(tour.translations).map(
        async ([lang, translation]) => {
          const language = lang as Language;
          const { error: translationError } = await supabase
            .from('tour_translations')
            .insert({
              tour_id: tour.id,
              language,
              name: translation.name,
              description: translation.description,
              location: translation.location
            });
          
          if (translationError) {
            console.error(`Error updating ${language} translation:`, translationError);
            throw new Error(`Failed to update ${language} translation: ${translationError.message}`);
          }
        }
      );
      
      await Promise.all(translationPromises);
      
      toast({
        title: "Tour Updated",
        description: `Tour ${tour.translations.en.name} has been updated successfully.`
      });
      
      return true;
    } catch (error) {
      console.error("Error in updateTour:", error);
      toast({
        title: "Error Updating Tour",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a tour
  const deleteTour = async (id: string, tourName: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Delete tour (translations will cascade due to foreign key)
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting tour:", error);
        throw new Error(`Failed to delete tour: ${error.message}`);
      }
      
      toast({
        title: "Tour Deleted",
        description: `Tour ${tourName} has been deleted.`
      });
      
      return true;
    } catch (error) {
      console.error("Error in deleteTour:", error);
      toast({
        title: "Error Deleting Tour",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createTour,
    updateTour,
    deleteTour
  };
}
