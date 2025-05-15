
import React, { createContext, useState, useContext, ReactNode } from 'react';

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

// Initial demo data
const initialTours = [
  {
    id: "1",
    name: "The Grand Resort",
    location: "East Barrett",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    category: "Featured",
    description: "Experience the beauty of Lombok with our exclusive package at The Grand Resort.",
    rating: 4.8,
    originalPrice: 499,
    discountPrice: 288,
    dates: {
      start: new Date(2023, 6, 20),
      end: new Date(2023, 6, 23)
    },
    participants: 4
  },
  {
    id: "2",
    name: "Beach Paradise",
    location: "Steuberbury",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    category: "Family-friendly",
    description: "Perfect getaway for families looking for relaxation and fun activities.",
    rating: 4.7,
    originalPrice: 355,
    discountPrice: 287,
    dates: {
      start: new Date(2023, 7, 15),
      end: new Date(2023, 7, 20)
    },
    participants: 6
  },
  {
    id: "3",
    name: "Mountain Retreat",
    location: "Idaview",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
    category: "Featured",
    description: "Experience breathtaking mountain views and peaceful surroundings.",
    rating: 4.9,
    originalPrice: 355,
    discountPrice: 288,
    dates: {
      start: new Date(2023, 8, 10),
      end: new Date(2023, 8, 15)
    },
    participants: 2
  },
  {
    id: "4",
    name: "Lakeside Cabin",
    location: "Yasminturt",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    category: "On sale",
    description: "Relax by the lake in our comfortable cabins with stunning views.",
    rating: 4.7,
    originalPrice: 355,
    discountPrice: 267,
    dates: {
      start: new Date(2023, 9, 5),
      end: new Date(2023, 9, 10)
    },
    participants: 4
  },
  {
    id: "5",
    name: "Coastal Escape",
    location: "North Edenshire",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
    category: "Featured",
    description: "Enjoy the coastal breeze and beautiful ocean views.",
    rating: 4.9,
    originalPrice: 499,
    discountPrice: 288,
    dates: {
      start: new Date(2023, 10, 15),
      end: new Date(2023, 10, 20)
    },
    participants: 2
  },
  {
    id: "6",
    name: "Forest Hideaway",
    location: "West Gregoria",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
    category: "Family-friendly",
    description: "Disconnect and immerse yourself in nature with our forest hideaway.",
    rating: 4.8,
    originalPrice: 399,
    discountPrice: 267,
    dates: {
      start: new Date(2023, 11, 10),
      end: new Date(2023, 11, 15)
    },
    participants: 6
  }
];

type ToursContextType = {
  tours: Tour[];
  addTour: (tour: Omit<Tour, 'id'>) => void;
  updateTour: (tour: Tour) => void;
  deleteTour: (id: string) => void;
};

const ToursContext = createContext<ToursContextType | undefined>(undefined);

export const ToursProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>(() => {
    // Try to get tours from localStorage
    const savedTours = localStorage.getItem('tours');
    return savedTours ? JSON.parse(savedTours, (key, value) => {
      // Convert date strings back to Date objects
      if (key === 'start' || key === 'end') {
        return new Date(value);
      }
      return value;
    }) : initialTours;
  });

  const saveTours = (updatedTours: Tour[]) => {
    localStorage.setItem('tours', JSON.stringify(updatedTours));
    setTours(updatedTours);
  };

  const addTour = (tour: Omit<Tour, 'id'>) => {
    const newTour = {
      ...tour,
      id: Math.random().toString(36).substring(2, 9),
      rating: 5.0, // Default rating for new tours
    };
    
    const updatedTours = [...tours, newTour as Tour];
    saveTours(updatedTours);
  };

  const updateTour = (updatedTour: Tour) => {
    const updatedTours = tours.map(tour => 
      tour.id === updatedTour.id ? updatedTour : tour
    );
    saveTours(updatedTours);
  };

  const deleteTour = (id: string) => {
    const updatedTours = tours.filter(tour => tour.id !== id);
    saveTours(updatedTours);
  };

  return (
    <ToursContext.Provider value={{ tours, addTour, updateTour, deleteTour }}>
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
