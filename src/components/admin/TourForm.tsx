
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import TourTranslations from './TourTranslations';
import { useLanguage, Language } from '@/contexts/LanguageContext';

// Define tour translation type
type TourTranslation = {
  name: string;
  description: string;
  location: string;
  language: Language;
};

// Tour form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.string().min(2, 'Category is required'),
  location: z.string().min(3, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  originalPrice: z.coerce.number().positive('Price must be positive'),
  discountPrice: z.coerce.number().positive('Discount price must be positive').optional(),
  participants: z.coerce.number().positive('Participants must be positive').optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  image: z.string().optional(),
  translations: z.record(z.string(), z.any()).optional(),
});

export type TourFormValues = z.infer<typeof formSchema>;

interface TourFormProps {
  tour?: any;
  onSubmit: (values: any, imageFile?: File) => Promise<void>;
}

const TourForm: React.FC<TourFormProps> = ({ tour, onSubmit }) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [translations, setTranslations] = useState<Record<Language, TourTranslation>>({
    en: {
      name: tour?.name || '',
      description: tour?.description || '',
      location: tour?.location || '',
      language: 'en',
    },
    ka: {
      name: tour?.translations?.ka?.name || '',
      description: tour?.translations?.ka?.description || '',
      location: tour?.translations?.ka?.location || '',
      language: 'ka',
    },
    ru: {
      name: tour?.translations?.ru?.name || '',
      description: tour?.translations?.ru?.description || '',
      location: tour?.translations?.ru?.location || '',
      language: 'ru',
    },
  });
  
  // Initialize react-hook-form
  const form = useForm<TourFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tour?.name || '',
      category: tour?.category || '',
      location: tour?.location || '',
      description: tour?.description || '',
      originalPrice: tour?.originalPrice || undefined,
      discountPrice: tour?.discountPrice || undefined,
      participants: tour?.participants || undefined,
      startDate: tour?.dates?.start ? new Date(tour.dates.start) : new Date(),
      endDate: tour?.dates?.end ? new Date(tour.dates.end) : new Date(),
      image: tour?.image || '',
    },
  });

  // Set image preview if tour has an image
  useEffect(() => {
    if (tour?.image) {
      setImagePreview(tour.image);
    }
  }, [tour]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue('image', URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (values: TourFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare tour data with translations
      const tourData = {
        ...values,
        dates: {
          start: values.startDate,
          end: values.endDate,
        },
        rating: tour?.rating || 5.0,
        id: tour?.id,
        translations,
      };
      
      // Remove redundant fields
      delete tourData.startDate;
      delete tourData.endDate;
      
      await onSubmit(tourData, imageFile || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle translations save
  const handleTranslationsSave = (translationsData: Record<Language, TourTranslation>) => {
    setTranslations(translationsData);
    
    // Update main form with English values
    if (translationsData.en) {
      form.setValue('name', translationsData.en.name);
      form.setValue('description', translationsData.en.description);
      form.setValue('location', translationsData.en.location);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Basic Info Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Adventure, Food & Wine, Beach" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('price')}</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Price (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.getValues('startDate')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              {/* Image Upload */}
              <div className="mb-6">
                <FormLabel>Tour Image</FormLabel>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-48 w-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-sm text-gray-500">
                          Click to upload an image
                        </p>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {!imagePreview && !tour?.image && (
                  <p className="text-xs text-gray-500 mt-2">
                    No image selected. A placeholder will be used.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Multilingual Content */}
          <TourTranslations
            initialValues={{
              name: form.getValues('name'),
              description: form.getValues('description'),
              location: form.getValues('location'),
            }}
            onSave={handleTranslationsSave}
          />
          
          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-travel-coral hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tour ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                tour ? 'Update Tour' : 'Create Tour'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TourForm;
