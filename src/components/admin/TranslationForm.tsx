
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Language, useLanguage } from '@/contexts/LanguageContext';
import { TourTranslation } from '@/types/tour';
import { toast } from "@/components/ui/use-toast";

type TranslationFormProps = {
  initialValues?: {
    name: string;
    description: string;
    longDescription?: string;
    location: string;
  };
  existingTranslations?: Record<Language, TourTranslation>;
  onChange: (translations: Record<Language, TourTranslation>) => void;
};

const TranslationForm: React.FC<TranslationFormProps> = ({
  initialValues,
  existingTranslations,
  onChange
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Language>('en');
  
  // Initialize translations with existing values or empty values
  const [translations, setTranslations] = useState<Record<Language, TourTranslation>>({
    en: existingTranslations?.en || {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      longDescription: initialValues?.longDescription || '',
      location: initialValues?.location || '',
      language: 'en'
    },
    ka: existingTranslations?.ka || {
      name: '',
      description: '',
      longDescription: '',
      location: '',
      language: 'ka'
    },
    ru: existingTranslations?.ru || {
      name: '',
      description: '',
      longDescription: '',
      location: '',
      language: 'ru'
    }
  });

  // Handle translation change
  const handleChange = (lang: Language, field: keyof TourTranslation, value: string) => {
    const updatedTranslations = {
      ...translations,
      [lang]: {
        ...translations[lang],
        [field]: value
      }
    };
    
    setTranslations(updatedTranslations);
    
    // For English values, update immediately
    if (lang === 'en') {
      onChange(updatedTranslations);
    }
  };

  // Handle save button click
  const handleSave = () => {
    // Copy English values to empty fields in other languages
    const validatedTranslations = { ...translations };
    
    // Ensure English name is not empty
    if (!validatedTranslations.en.name) {
      toast({
        title: "Validation Error",
        description: "English tour name is required",
        variant: "destructive",
      });
      return;
    }
    
    // Fill empty fields with English values
    for (const lang of ['ka', 'ru'] as Language[]) {
      if (!validatedTranslations[lang].name) {
        validatedTranslations[lang].name = validatedTranslations.en.name;
      }
      if (!validatedTranslations[lang].description) {
        validatedTranslations[lang].description = validatedTranslations.en.description;
      }
      if (!validatedTranslations[lang].longDescription) {
        validatedTranslations[lang].longDescription = validatedTranslations.en.longDescription || validatedTranslations.en.description;
      }
      if (!validatedTranslations[lang].location) {
        validatedTranslations[lang].location = validatedTranslations.en.location;
      }
    }
    
    // Update parent component
    onChange(validatedTranslations);
    
    toast({
      title: "Translations Saved",
      description: "All translations have been saved successfully.",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">{t('translations')}</h3>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Language)}>
          <TabsList className="mb-4">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ka">ქართული</TabsTrigger>
            <TabsTrigger value="ru">Русский</TabsTrigger>
          </TabsList>
          
          {(['en', 'ka', 'ru'] as Language[]).map((lang) => (
            <TabsContent key={lang} value={lang} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tour_name')}
                </label>
                <Input
                  value={translations[lang].name}
                  onChange={(e) => handleChange(lang, 'name', e.target.value)}
                  placeholder={lang === 'en' ? 'Tour name' : lang === 'ka' ? 'ტურის სახელი' : 'Название тура'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <Textarea
                  value={translations[lang].description}
                  onChange={(e) => handleChange(lang, 'description', e.target.value)}
                  placeholder={lang === 'en' ? 'Brief description for listings' : lang === 'ka' ? 'მოკლე აღწერა' : 'Краткое описание'}
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Description
                </label>
                <Textarea
                  value={translations[lang].longDescription || ''}
                  onChange={(e) => handleChange(lang, 'longDescription', e.target.value)}
                  placeholder={lang === 'en' ? 'Detailed description for tour page' : lang === 'ka' ? 'დეტალური აღწერა' : 'Подробное описание'}
                  rows={6}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tour_location')}
                </label>
                <Input
                  value={translations[lang].location}
                  onChange={(e) => handleChange(lang, 'location', e.target.value)}
                  placeholder={lang === 'en' ? 'Location' : lang === 'ka' ? 'მდებარეობა' : 'Местоположение'}
                />
              </div>
              
              {lang !== 'en' && (
                <div className="mt-2 text-sm text-gray-500">
                  {lang === 'ka' ? 'თარგმნეთ ინფორმაცია ქართულად' : 'Переведите информацию на русский язык'}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6">
          <Button onClick={handleSave} className="bg-travel-coral text-white hover:bg-orange-600">
            Save Translations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationForm;
