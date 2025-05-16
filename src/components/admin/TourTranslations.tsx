
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { toast } from "@/components/ui/use-toast";

type TourTranslation = {
  name: string;
  description: string;
  location: string;
  language: Language;
};

type TourTranslationsProps = {
  initialValues?: {
    name: string;
    description: string;
    location: string;
  };
  existingTranslations?: Record<Language, TourTranslation>;
  onSave: (translations: Record<Language, TourTranslation>) => void;
};

const TourTranslations: React.FC<TourTranslationsProps> = ({ 
  initialValues, 
  existingTranslations, 
  onSave 
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Language>('en');
  
  // Initialize with existing translations or empty values
  const [translations, setTranslations] = useState<Record<Language, TourTranslation>>({
    en: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      location: initialValues?.location || '',
      language: 'en'
    },
    ka: {
      name: '',
      description: '',
      location: '',
      language: 'ka'
    },
    ru: {
      name: '',
      description: '',
      location: '',
      language: 'ru'
    }
  });
  
  // Update translations if existingTranslations prop changes
  useEffect(() => {
    if (existingTranslations) {
      // Deep copy to ensure we don't mutate props
      const updatedTranslations = {
        en: existingTranslations.en ? { ...existingTranslations.en } : translations.en,
        ka: existingTranslations.ka ? { ...existingTranslations.ka } : translations.ka,
        ru: existingTranslations.ru ? { ...existingTranslations.ru } : translations.ru
      };
      
      setTranslations(updatedTranslations);
    } else if (initialValues) {
      // If no translations but we have initial values, update English
      setTranslations(prev => ({
        ...prev,
        en: {
          ...prev.en,
          name: initialValues.name || prev.en.name,
          description: initialValues.description || prev.en.description,
          location: initialValues.location || prev.en.location,
        }
      }));
    }
  }, [existingTranslations, initialValues]);

  const handleChange = (lang: Language, field: keyof TourTranslation, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Make sure all languages have at least the name field filled
    const validatedTranslations = { ...translations };
    for (const lang of ['ka', 'ru'] as Language[]) {
      if (!validatedTranslations[lang].name) {
        // Fall back to English for empty fields
        validatedTranslations[lang].name = validatedTranslations.en.name;
      }
      if (!validatedTranslations[lang].description) {
        validatedTranslations[lang].description = validatedTranslations.en.description;
      }
      if (!validatedTranslations[lang].location) {
        validatedTranslations[lang].location = validatedTranslations.en.location;
      }
    }
    
    onSave(validatedTranslations);
    
    toast({
      title: t('translations_saved'),
      description: t('translations_saved_description'),
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">{t('translations')}</h3>
        
        <Tabs defaultValue="en" value={activeTab} onValueChange={(value) => setActiveTab(value as Language)}>
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
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tour_description')}
                </label>
                <Textarea
                  value={translations[lang].description}
                  onChange={(e) => handleChange(lang, 'description', e.target.value)}
                  placeholder={lang === 'en' ? 'Tour description' : lang === 'ka' ? 'ტურის აღწერა' : 'Описание тура'}
                  className="w-full"
                  rows={5}
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
                  className="w-full"
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
            {t('save_translations')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourTranslations;
