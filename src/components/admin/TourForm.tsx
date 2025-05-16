import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Calendar as CalendarIcon, Loader2, Image, Images, Plus, X, Upload } from "lucide-react";
import TranslationForm from './TranslationForm';
import { Language, useLanguage } from '@/contexts/LanguageContext';
import { Tour, TourTranslation } from '@/types/tour';
import { TourImage } from '@/hooks/useTourOperations';

// Tour form schema with Zod
const formSchema = z.object({
  category: z.string().min(2, 'Category is required'),
  originalPrice: z.coerce.number().positive('Price must be positive'),
  discountPrice: z.coerce.number().positive('Discount price must be positive').optional(),
  participants: z.coerce.number().positive('Participants must be positive').optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  image: z.string().optional(),
});

type TourFormValues = z.infer<typeof formSchema>;

interface TourFormProps {
  tour?: Tour;
  isSubmitting: boolean;
  onSubmit: (tourData: any, imageFiles?: File[]) => Promise<void>;
  onCancel: () => void;
}

const TourForm: React.FC<TourFormProps> = ({ 
  tour, 
  isSubmitting, 
  onSubmit, 
  onCancel 
}) => {
  const { t } = useLanguage();
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<TourImage[]>([]);
  const [translations, setTranslations] = useState<Record<Language, TourTranslation>>({
    en: {
      name: tour?.translations.en.name || '',
      description: tour?.translations.en.description || '',
      location: tour?.translations.en.location || '',
      language: 'en'
    },
    ka: {
      name: tour?.translations.ka.name || '',
      description: tour?.translations.ka.description || '',
      location: tour?.translations.ka.location || '',
      language: 'ka'
    },
    ru: {
      name: tour?.translations.ru.name || '',
      description: tour?.translations.ru.description || '',
      location: tour?.translations.ru.location || '',
      language: 'ru'
    }
  });

  // Initialize form
  const form = useForm<TourFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: tour?.category || '',
      originalPrice: tour?.originalPrice || undefined,
      discountPrice: tour?.discountPrice || undefined,
      participants: tour?.participants || undefined,
      startDate: tour?.dates.start ? new Date(tour.dates.start) : new Date(),
      endDate: tour?.dates.end ? new Date(tour.dates.end) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      image: tour?.image || '',
    },
  });

  // Set image preview if tour has an image
  useEffect(() => {
    if (tour?.image) {
      setImagePreview(tour.image);
    }
    
    // Initialize existing images if available
    if (tour?.images && tour.images.length > 0) {
      setExistingImages(tour.images);
    }
  }, [tour]);

  // Handle main image change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setMainImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      form.setValue('image', previewUrl);
    }
  };
  
  // Handle additional images change
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...additionalImageFiles, ...files];
      setAdditionalImageFiles(newFiles);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews([...additionalImagePreviews, ...newPreviews]);
    }
  };
  
  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    const newFiles = [...additionalImageFiles];
    newFiles.splice(index, 1);
    setAdditionalImageFiles(newFiles);
    
    const newPreviews = [...additionalImagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setAdditionalImagePreviews(newPreviews);
  };
  
  // Remove existing image
  const removeExistingImage = (id: string) => {
    setExistingImages(existingImages.filter(img => img.id !== id));
  };
  
  // Set an existing image as main
  const setMainImage = (id: string) => {
    setExistingImages(
      existingImages.map(img => ({
        ...img,
        isMain: img.id === id
      }))
    );
  };

  // Handle translations change
  const handleTranslationsChange = (updatedTranslations: Record<Language, TourTranslation>) => {
    setTranslations(updatedTranslations);
  };

  // Handle form submission
  const handleSubmit = async (values: TourFormValues) => {
    try {
      // Check if we have a name in the English translation
      if (!translations.en.name) {
        form.setError('category', {
          type: 'manual',
          message: 'Tour name is required in English'
        });
        return;
      }
      
      // Prepare tour data
      const tourData = {
        ...values,
        dates: {
          start: values.startDate,
          end: values.endDate
        },
        rating: tour?.rating || 5.0,
        id: tour?.id,
        translations,
        existingImages: tour ? existingImages : undefined
      };
      
      // Prepare image files
      const imageFiles = [];
      if (mainImageFile) {
        imageFiles.push(mainImageFile);
      }
      imageFiles.push(...additionalImageFiles);
      
      // Submit the form
      await onSubmit(tourData, imageFiles.length > 0 ? imageFiles : undefined);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Basic Info */}
            <div className="space-y-6">
              {/* Category field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('category')}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Adventure, Beach, Cultural" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Price fields */}
              <div className="grid grid-cols-2 gap-4">
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
                      <FormLabel>Discount Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="Optional" 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Participants field */}
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Optional"
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Date fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
            
            {/* Right column - Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div>
                <FormLabel>Main Tour Image</FormLabel>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-travel-coral transition-colors">
                  <label htmlFor="main-image-upload" className="cursor-pointer block">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Tour preview"
                          className="h-48 w-full object-cover rounded-md"
                        />
                        <button 
                          type="button"
                          className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-80"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMainImageFile(null);
                            setImagePreview('');
                            form.setValue('image', '');
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Image className="h-14 w-14 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Click to upload a main image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, or JPEG (max. 10MB)
                        </p>
                      </div>
                    )}
                    <input
                      id="main-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              {/* Additional Images */}
              <div>
                <FormLabel>Additional Images</FormLabel>
                
                {/* Existing Images (for editing) */}
                {tour && existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Existing Images</p>
                    <div className="grid grid-cols-3 gap-3">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative rounded-md overflow-hidden border border-gray-200">
                          <img src={img.url} alt="Tour" className="w-full h-24 object-cover" />
                          <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity duration-200 flex flex-col justify-center items-center gap-2">
                            <button
                              type="button"
                              className="text-white bg-red-500 hover:bg-red-600 rounded-full p-1"
                              onClick={() => removeExistingImage(img.id)}
                            >
                              <X size={14} />
                            </button>
                            {!img.isMain && (
                              <button
                                type="button"
                                className="text-white bg-blue-500 hover:bg-blue-600 rounded-full p-1"
                                onClick={() => setMainImage(img.id)}
                                title="Set as main image"
                              >
                                <Image size={14} />
                              </button>
                            )}
                            {img.isMain && (
                              <span className="text-xs text-white bg-green-500 px-2 py-1 rounded-full">
                                Main
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Additional Images */}
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                      <img src={preview} alt={`Additional ${index + 1}`} className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-gray-900 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-80"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Image Button */}
                  <label htmlFor="additional-images-upload" className="border-2 border-dashed border-gray-300 h-24 rounded-md p-2 flex flex-col items-center justify-center cursor-pointer hover:border-travel-coral transition-colors">
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500 text-center">Add more images</span>
                    <input
                      id="additional-images-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Translations Section */}
          <TranslationForm
            initialValues={{
              name: translations.en.name,
              description: translations.en.description,
              location: translations.en.location
            }}
            existingTranslations={translations}
            onChange={handleTranslationsChange}
          />
          
          {/* Submit and Cancel buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-travel-coral hover:bg-orange-600 text-white"
              disabled={isSubmitting}
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
