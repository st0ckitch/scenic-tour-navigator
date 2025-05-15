
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type Tour = {
  id: string;
  name: string;
  location: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  originalPrice: number;
  discountPrice?: number;
  dates: {
    start: Date;
    end: Date;
  };
  participants?: number;
};

// Type for the database row
type TourRow = {
  id: string;
  name: string;
  location: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  original_price: number;
  discount_price?: number;
  start_date: string;
  end_date: string;
  participants?: number;
};

type ToursContextType = {
  tours: Tour[];
  loading: boolean;
  addTour: (tour: Omit<Tour, 'id'>, imageFile?: File) => Promise<void>;
  updateTour: (tour: Tour, imageFile?: File) => Promise<void>;
  deleteTour: (id: string) => Promise<void>;
};

const ToursContext = createContext<ToursContextType | undefined>(undefined);

// Convert database row to app Tour type
const convertRowToTour = (row: TourRow): Tour => ({
  id: row.id,
  name: row.name,
  location: row.location,
  image: row.image,
  category: row.category,
  description: row.description,
  rating: row.rating,
  originalPrice: row.original_price,
  discountPrice: row.discount_price,
  dates: {
    start: new Date(row.start_date),
    end: new Date(row.end_date),
  },
  participants: row.participants,
});

export const ToursProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tours from Supabase on component mount
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data, error } = await supabase
          .from('tours')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (data) {
          const convertedTours = data.map(convertRowToTour);
          setTours(convertedTours);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        toast({
          title: "Error loading tours",
          description: "Could not load tours from database",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Upload image file to storage and get URL
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Add a new tour
  const addTour = async (tour: Omit<Tour, 'id'>, imageFile?: File) => {
    setLoading(true);
    try {
      let imageUrl = tour.image;
      
      // If file is provided, upload it first
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { data, error } = await supabase
        .from('tours')
        .insert({
          name: tour.name,
          location: tour.location,
          image: imageUrl,
          category: tour.category,
          description: tour.description,
          original_price: tour.originalPrice,
          discount_price: tour.discountPrice,
          start_date: tour.dates.start.toISOString(),
          end_date: tour.dates.end.toISOString(),
          participants: tour.participants,
          rating: 5.0, // Default for new tours
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newTour = convertRowToTour(data as TourRow);
        setTours(currentTours => [...currentTours, newTour]);
      }
    } catch (error) {
      console.error('Error adding tour:', error);
      toast({
        title: "Error adding tour",
        description: "Could not add tour to database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update an existing tour
  const updateTour = async (updatedTour: Tour, imageFile?: File) => {
    setLoading(true);
    try {
      let imageUrl = updatedTour.image;
      
      // If file is provided, upload it first
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from('tours')
        .update({
          name: updatedTour.name,
          location: updatedTour.location,
          image: imageUrl,
          category: updatedTour.category,
          description: updatedTour.description,
          original_price: updatedTour.originalPrice,
          discount_price: updatedTour.discountPrice,
          start_date: updatedTour.dates.start.toISOString(),
          end_date: updatedTour.dates.end.toISOString(),
          participants: updatedTour.participants,
          rating: updatedTour.rating,
        })
        .eq('id', updatedTour.id);

      if (error) {
        throw error;
      }

      // Update local state
      setTours(currentTours => 
        currentTours.map(tour => 
          tour.id === updatedTour.id ? updatedTour : tour
        )
      );
    } catch (error) {
      console.error('Error updating tour:', error);
      toast({
        title: "Error updating tour",
        description: "Could not update tour in database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a tour
  const deleteTour = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setTours(currentTours => currentTours.filter(tour => tour.id !== id));
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast({
        title: "Error deleting tour",
        description: "Could not delete tour from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToursContext.Provider value={{ tours, loading, addTour, updateTour, deleteTour }}>
      {children}
    </ToursContext.Provider>
  );
};

export const useTours = () => {
  const context = useContext(ToursContext);
  if (context === undefined) {
    throw new Error('useTours must be used within a ToursProvider');
  }
  return context;
};
