
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Language } from '@/contexts/LanguageContext';
import { Tour, NewTour, TourTranslation } from '@/types/tour';

export type TourImage = {
  id: string;
  url: string;
  isMain: boolean;
};

export function useTourOperations() {
  const [loading, setLoading] = useState(false);

  // Helper function to upload images
  const uploadImages = async (tourId: string, imageFiles: File[]): Promise<TourImage[]> => {
    const uploadedImages: TourImage[] = [];
    
    // In a real app, this would upload to Supabase storage
    // For this example, we're just creating image URLs
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      // This is just a placeholder - in a real app, you would upload to Supabase storage
      const imageUrl = URL.createObjectURL(file);
      
      const isMain = i === 0; // First image is the main image
      
      const { data: imageData, error: imageError } = await supabase
        .from('tour_images')
        .insert({
          tour_id: tourId,
          url: imageUrl,
          is_main: isMain
        })
        .select()
        .single();
      
      if (imageError) {
        console.error(`Error uploading image ${i}:`, imageError);
        continue;
      }
      
      uploadedImages.push({
        id: imageData.id,
        url: imageUrl,
        isMain: isMain
      });
    }
    
    return uploadedImages;
  };

  // Create a new tour
  const createTour = async (newTour: NewTour, imageFiles?: File[]): Promise<Tour | null> => {
    try {
      setLoading(true);
      console.log("Creating tour with data:", JSON.stringify(newTour, null, 2));
      
      // Handle image upload if provided
      let mainImage = newTour.image;
      
      // In a real app, upload image to Supabase storage
      if (imageFiles && imageFiles.length > 0) {
        // This is just a placeholder for demo
        mainImage = URL.createObjectURL(imageFiles[0]);
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
          image: mainImage, // Keep for backward compatibility
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
      
      // Upload additional images if provided
      let tourImages: TourImage[] = [];
      if (imageFiles && imageFiles.length > 0) {
        tourImages = await uploadImages(tourId, imageFiles);
      }
      
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
              longDescription: translation.longDescription,
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
        image: mainImage,
        images: tourImages,
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
  const updateTour = async (tour: Tour, imageFiles?: File[]): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("Updating tour:", JSON.stringify(tour, null, 2));
      
      // Handle image update if needed
      let mainImage = tour.image;
      if (imageFiles && imageFiles.length > 0) {
        // This is just a placeholder for demo
        mainImage = URL.createObjectURL(imageFiles[0]);
      }
      
      // Update tour in database
      const { error: tourError } = await supabase
        .from('tours')
        .update({
          category: tour.category,
          original_price: tour.originalPrice,
          discount_price: tour.discountPrice,
          participants: tour.participants,
          image: mainImage, // Keep for backward compatibility
          start_date: tour.dates.start.toISOString(),
          end_date: tour.dates.end.toISOString()
        })
        .eq('id', tour.id);
      
      if (tourError) {
        console.error("Error updating tour:", tourError);
        throw new Error(`Failed to update tour: ${tourError.message}`);
      }
      
      // Handle tour images
      
      // 1. Delete removed existing images
      if (tour.existingImages) {
        const existingImageIds = tour.existingImages.map(img => img.id);
        console.log("Existing image IDs:", existingImageIds);
        
        if (existingImageIds.length > 0) {
          // Delete images that are not in the existingImages list
          const { error: deleteImagesError } = await supabase
            .from('tour_images')
            .delete()
            .eq('tour_id', tour.id)
            .not('id', 'in', `(${existingImageIds.join(',')})`);
          
          if (deleteImagesError) {
            console.error("Error deleting removed images:", deleteImagesError);
          }
          
          // Update main image flag
          for (const image of tour.existingImages) {
            await supabase
              .from('tour_images')
              .update({ is_main: image.isMain })
              .eq('id', image.id);
          }
        } else {
          // If no existing images are kept, delete all images for this tour
          const { error: deleteAllImagesError } = await supabase
            .from('tour_images')
            .delete()
            .eq('tour_id', tour.id);
          
          if (deleteAllImagesError) {
            console.error("Error deleting all tour images:", deleteAllImagesError);
          }
        }
      }
      
      // 2. Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        await uploadImages(tour.id, imageFiles);
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
              longDescription: translation.longDescription,
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
      
      // Delete tour (translations and images will cascade due to foreign key)
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
