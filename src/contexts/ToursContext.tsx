
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useLanguage, Language } from '@/contexts/LanguageContext';

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

  // Mock function to simulate loading tours from an API
  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Sample tour data
        const sampleTours: Tour[] = [
          {
            id: '1',
            name: 'Tbilisi Old Town Tour',
            description: 'Explore the historic Old Town of Tbilisi with its cobblestone streets, ancient churches, and iconic landmarks.',
            location: 'Tbilisi, Georgia',
            image: 'https://images.unsplash.com/photo-1598901627264-c1de94d39408?auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            originalPrice: 89,
            discountPrice: 69,
            category: 'Urban',
            participants: 15,
            dates: {
              start: new Date(2025, 5, 10),
              end: new Date(2025, 5, 14),
            },
            translations: {
              en: {
                name: 'Tbilisi Old Town Tour',
                description: 'Explore the historic Old Town of Tbilisi with its cobblestone streets, ancient churches, and iconic landmarks.',
                location: 'Tbilisi, Georgia',
                language: 'en',
              },
              ka: {
                name: 'თბილისის ძველი ქალაქის ტური',
                description: 'გამოიკვლიეთ თბილისის ისტორიული ძველი ქალაქი მისი ქვაფენილის ქუჩებით, უძველესი ეკლესიებით და იკონური ღირსშესანიშნაობებით.',
                location: 'თბილისი, საქართველო',
                language: 'ka',
              },
              ru: {
                name: 'Тур по Старому городу Тбилиси',
                description: 'Исследуйте исторический Старый город Тбилиси с его мощеными улицами, древними церквями и культовыми достопримечательностями.',
                location: 'Тбилиси, Грузия',
                language: 'ru',
              },
            },
          },
          {
            id: '2',
            name: 'Kakheti Wine Tour',
            description: 'Discover the birthplace of wine in Georgia\'s picturesque Kakheti region, visiting traditional wineries and tasting authentic Georgian wines.',
            location: 'Kakheti, Georgia',
            image: 'https://images.unsplash.com/photo-1584535556399-59933baf9d45?auto=format&fit=crop&w=800&q=80',
            rating: 4.9,
            originalPrice: 120,
            discountPrice: 95,
            category: 'Food & Wine',
            dates: {
              start: new Date(2025, 6, 5),
              end: new Date(2025, 6, 9),
            },
            translations: {
              en: {
                name: 'Kakheti Wine Tour',
                description: 'Discover the birthplace of wine in Georgia\'s picturesque Kakheti region, visiting traditional wineries and tasting authentic Georgian wines.',
                location: 'Kakheti, Georgia',
                language: 'en',
              },
              ka: {
                name: 'კახეთის ღვინის ტური',
                description: 'აღმოაჩინეთ ღვინის სამშობლო საქართველოს პიტორესკულ კახეთის რეგიონში, ტრადიციული ღვინის მარნებისა და ავთენტური ქართული ღვინოების დაგემოვნებით.',
                location: 'კახეთი, საქართველო',
                language: 'ka',
              },
              ru: {
                name: 'Винный тур по Кахетии',
                description: 'Откройте для себя родину вина в живописном регионе Кахетия в Грузии, посетите традиционные винодельни и попробуйте настоящие грузинские вина.',
                location: 'Кахетия, Грузия',
                language: 'ru',
              },
            },
          },
          {
            id: '3',
            name: 'Kazbegi Mountain Adventure',
            description: 'Embark on a thrilling journey to Mount Kazbek, one of Georgia\'s most iconic peaks, exploring alpine meadows and ancient monasteries.',
            location: 'Kazbegi, Georgia',
            image: 'https://images.unsplash.com/photo-1559060649-972b78a6c7a4?auto=format&fit=crop&w=800&q=80',
            rating: 4.7,
            originalPrice: 150,
            category: 'Adventure',
            participants: 10,
            dates: {
              start: new Date(2025, 7, 15),
              end: new Date(2025, 7, 20),
            },
            translations: {
              en: {
                name: 'Kazbegi Mountain Adventure',
                description: 'Embark on a thrilling journey to Mount Kazbek, one of Georgia\'s most iconic peaks, exploring alpine meadows and ancient monasteries.',
                location: 'Kazbegi, Georgia',
                language: 'en',
              },
              ka: {
                name: 'ყაზბეგის სამთო თავგადასავალი',
                description: 'დაიწყეთ აღმაფრთოვანებელი მოგზაურობა მთა ყაზბეკზე, საქართველოს ერთ-ერთ ყველაზე იკონური მწვერვალზე, ალპური მდელოებისა და ძველი მონასტრების გამოკვლევით.',
                location: 'ყაზბეგი, საქართველო',
                language: 'ka',
              },
              ru: {
                name: 'Горное приключение в Казбеги',
                description: 'Отправьтесь в захватывающее путешествие к горе Казбек, одной из самых знаменитых вершин Грузии, исследуя альпийские луга и древние монастыри.',
                location: 'Казбеги, Грузия',
                language: 'ru',
              },
            },
          },
          {
            id: '4',
            name: 'Batumi Beach Retreat',
            description: 'Relax on the beautiful Black Sea coast in Batumi, enjoying the beach, vibrant nightlife, and exciting water activities.',
            location: 'Batumi, Georgia',
            image: 'https://images.unsplash.com/photo-15777730831-b1eef17c3a9e?auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            originalPrice: 200,
            discountPrice: 160,
            category: 'Beach',
            participants: 20,
            dates: {
              start: new Date(2025, 8, 2),
              end: new Date(2025, 8, 8),
            },
            translations: {
              en: {
                name: 'Batumi Beach Retreat',
                description: 'Relax on the beautiful Black Sea coast in Batumi, enjoying the beach, vibrant nightlife, and exciting water activities.',
                location: 'Batumi, Georgia',
                language: 'en',
              },
              ka: {
                name: 'ბათუმის სანაპირო დასვენება',
                description: 'დაისვენეთ შავი ზღვის ლამაზ სანაპიროზე ბათუმში, დატკბით პლაჟით, მბრწყინავი ღამის ცხოვრებით და აღმაფრთოვანებელი წყლის აქტივობებით.',
                location: 'ბათუმი, საქართველო',
                language: 'ka',
              },
              ru: {
                name: 'Отдых на пляже Батуми',
                description: 'Расслабьтесь на прекрасном черноморском побережье в Батуми, наслаждаясь пляжем, яркой ночной жизнью и захватывающими водными развлечениями.',
                location: 'Батуми, Грузия',
                language: 'ru',
              },
            },
          },
          {
            id: '5',
            name: 'Svaneti Hiking Expedition',
            description: 'Journey to the remote and mystical region of Svaneti, known for its medieval tower houses and dramatic mountain landscapes.',
            location: 'Svaneti, Georgia',
            image: 'https://images.unsplash.com/photo-1562455534-a7a28871fad9?auto=format&fit=crop&w=800&q=80',
            rating: 4.6,
            originalPrice: 180,
            category: 'Hiking',
            dates: {
              start: new Date(2025, 6, 25),
              end: new Date(2025, 7, 3),
            },
            translations: {
              en: {
                name: 'Svaneti Hiking Expedition',
                description: 'Journey to the remote and mystical region of Svaneti, known for its medieval tower houses and dramatic mountain landscapes.',
                location: 'Svaneti, Georgia',
                language: 'en',
              },
              ka: {
                name: 'სვანეთის საფეხმავლო ექსპედიცია',
                description: 'იმოგზაურეთ სვანეთის შორეულ და მისტიურ რეგიონში, რომელიც ცნობილია თავისი შუასაუკუნეების კოშკებითა და დრამატული მთის ლანდშაფტებით.',
                location: 'სვანეთი, საქართველო',
                language: 'ka',
              },
              ru: {
                name: 'Пешеходная экспедиция в Сванетии',
                description: 'Путешествие в отдаленный и мистический регион Сванетии, известный своими средневековыми башнями и впечатляющими горными пейзажами.',
                location: 'Сванетия, Грузия',
                language: 'ru',
              },
            },
          },
          {
            id: '6',
            name: 'Borjomi Nature Reserve Tour',
            description: 'Explore the lush forests and healing mineral waters of Borjomi, one of Georgia\'s most beautiful natural retreats.',
            location: 'Borjomi, Georgia',
            image: 'https://images.unsplash.com/photo-1501446874657-8583783cb9d6?auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            originalPrice: 85,
            discountPrice: 70,
            category: 'Nature',
            participants: 12,
            dates: {
              start: new Date(2025, 5, 20),
              end: new Date(2025, 5, 23),
            },
            translations: {
              en: {
                name: 'Borjomi Nature Reserve Tour',
                description: 'Explore the lush forests and healing mineral waters of Borjomi, one of Georgia\'s most beautiful natural retreats.',
                location: 'Borjomi, Georgia',
                language: 'en',
              },
              ka: {
                name: 'ბორჯომის ბუნების ნაკრძალის ტური',
                description: 'გამოიკვლიეთ ბორჯომის ხშირი ტყეები და სამკურნალო მინერალური წყლები, საქართველოს ერთ-ერთი ულამაზესი ბუნებრივი კურორტი.',
                location: 'ბორჯომი, საქართველო',
                language: 'ka',
              },
              ru: {
                name: 'Тур по заповеднику Боржоми',
                description: 'Исследуйте пышные леса и целебные минеральные воды Боржоми, одного из самых красивых природных курортов Грузии.',
                location: 'Боржоми, Грузия',
                language: 'ru',
              },
            },
          },
        ];

        setTours(sampleTours);
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

  // Add a new tour
  const addTour = async (tour: Omit<Tour, 'id'>, imageFile?: File) => {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a random ID (in a real app, this would be done by the backend)
      const newId = Math.random().toString(36).substr(2, 9);
      
      // In a real app, we would upload the image to a storage service
      let imageUrl = tour.image;
      if (imageFile) {
        // This is just a placeholder, in a real app we'd upload the file
        imageUrl = URL.createObjectURL(imageFile);
      }
      
      const newTour: Tour = {
        ...tour,
        id: newId,
        image: imageUrl,
      };
      
      setTours(prevTours => [...prevTours, newTour]);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add tour:', error);
      return Promise.reject(error);
    }
  };
  
  // Update an existing tour
  const updateTour = async (updatedTour: Tour, imageFile?: File) => {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, we would upload the image to a storage service
      let imageUrl = updatedTour.image;
      if (imageFile) {
        // This is just a placeholder, in a real app we'd upload the file
        imageUrl = URL.createObjectURL(imageFile);
      }
      
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
      return Promise.reject(error);
    }
  };
  
  // Delete a tour
  const deleteTour = async (id: string) => {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTours(prevTours => prevTours.filter(tour => tour.id !== id));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to delete tour:', error);
      return Promise.reject(error);
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
