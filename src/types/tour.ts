
import { Language } from '@/contexts/LanguageContext';

export type TourDates = {
  start: Date;
  end: Date;
};

export type TourTranslation = {
  name: string;
  description: string;
  longDescription?: string;
  location: string;
  language: Language;
};

export type TourImage = {
  id: string;
  url: string;
  isMain: boolean;
};

export type Tour = {
  id: string;
  category: string;
  originalPrice: number;
  discountPrice?: number;
  participants?: number;
  rating: number;
  image?: string;
  images?: TourImage[];
  existingImages?: TourImage[];
  dates: TourDates;
  translations: Record<Language, TourTranslation>;
};

export type NewTour = Omit<Tour, 'id'>;

export type TourFormData = {
  category: string;
  originalPrice: number;
  discountPrice?: number;
  participants?: number;
  startDate: Date;
  endDate: Date;
  image?: string;
  translations: Record<Language, TourTranslation>;
};
