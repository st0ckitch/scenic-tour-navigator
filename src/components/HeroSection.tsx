
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection: React.FC = () => {  
  const { t } = useLanguage();
  
  return (
    <div className="relative h-screen mb-32">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-center text-white px-4 pt-40 mt-24">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 md:pr-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
            {t('welcome_to_georgia')}
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8">
            {t('georgia_subtitle')}
          </p>
        </div>
        
        {/* Custom Tour Form */}
        <div className="md:w-1/2 md:max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800">
            <h2 className="text-xl font-bold mb-4">{t('create_custom_tour')}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('custom_tour_subtitle')}
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('your_destination')}</label>
                <Input placeholder={t('destination_placeholder')} className="w-full" />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('arrival_date')}</label>
                <div className="relative">
                  <Input type="date" placeholder="Select date" className="w-full pl-10" />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('duration')}</label>
                <Input type="number" placeholder={t('number_of_days')} className="w-full" min="1" defaultValue="3" />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('group_size')}</label>
                <Input type="number" placeholder={t('number_of_travelers')} className="w-full" min="1" defaultValue="2" />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('special_requests')}</label>
                <Textarea placeholder={t('tell_us_interests')} className="w-full" />
              </div>
              
              <Button className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md transition-colors">
                {t('request_custom_tour')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
        {['LANDSCAPE', 'EXCURSION', 'JOURNEY', 'EXCITING', 'TRAVEL', 'BEACH'].map((tag) => (
          <span 
            key={tag} 
            className="tag bg-travel-sky px-4 py-1 rounded-full text-white text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
