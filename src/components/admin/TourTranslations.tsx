
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage, Language } from '@/contexts/LanguageContext';

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
  onSave: (translations: Record<Language, TourTranslation>) => void;
};

const TourTranslations: React.FC<TourTranslationsProps> = ({ initialValues, onSave }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Language>('en');
  
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
    onSave(translations);
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
