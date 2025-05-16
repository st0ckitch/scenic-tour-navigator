
import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const UnmissableExperienceSection: React.FC = () => {
  const { t } = useLanguage();
  
  // Array of images with location names and random rotation angles
  const experiencePhotos = [
    {
      src: "/lovable-uploads/f185a17f-5be7-4fe4-9d0a-54ff88ce4e28.png",
      location: "Gergeti Trinity Church",
      rotation: Math.floor(Math.random() * 16) - 8,
    },
    {
      src: "/lovable-uploads/4fae18dc-02be-4910-af5b-b244939a0829.png",
      location: "Jvari Monastery",
      rotation: Math.floor(Math.random() * 16) - 8,
    },
    {
      src: "/lovable-uploads/82fd0315-41f5-4c55-b27b-ec03987edd04.png",
      location: "Martvili Canyon",
      rotation: Math.floor(Math.random() * 16) - 8,
    },
    {
      src: "/lovable-uploads/07228c80-5116-4bc0-a82f-cf39a5acbff6.png",
      location: "Mirveti Waterfall",
      rotation: Math.floor(Math.random() * 16) - 8,
    },
  ];

  return (
    <section className="py-32 container mx-auto px-4 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left side - Chaotically placed photos */}
        <div className="relative h-[600px]">
          {experiencePhotos.map((photo, index) => (
            <div
              key={index}
              className="absolute shadow-xl rounded-lg overflow-hidden hover:z-10 transition-all duration-300 hover:shadow-2xl"
              style={{
                transform: `rotate(${photo.rotation}deg)`,
                top: `${20 + index * 15}%`,
                left: `${10 + (index % 2) * 30}%`,
                width: '240px',
                height: '180px',
                zIndex: index,
              }}
            >
              <img
                src={photo.src}
                alt={photo.location}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                <p className="text-sm font-medium">{photo.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Text and reviews */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t('unmissable_experiences')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('experiences_subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-travel-sky">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-current" size={18} />
              ))}
              <span className="text-gray-700 font-medium ml-2">4.9/5 {t('overall_rating')}</span>
            </div>
            
            <div className="flex flex-wrap justify-start items-center gap-2 mt-3">
              <div className="flex -space-x-4">
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white" 
                  src="https://randomuser.me/api/portraits/women/21.jpg" 
                  alt="User" 
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white" 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="User" 
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white" 
                  src="https://randomuser.me/api/portraits/women/45.jpg" 
                  alt="User" 
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white" 
                  src="https://randomuser.me/api/portraits/men/57.jpg" 
                  alt="User" 
                />
              </div>
              <p className="font-medium ml-2">
                <span className="text-travel-coral font-bold">150K</span> {t('happy_guests')}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-600 italic mb-3">
              {t('testimonial')}
            </p>
            <div className="flex items-center">
              <img 
                className="w-10 h-10 rounded-full mr-3" 
                src="https://randomuser.me/api/portraits/women/32.jpg" 
                alt="Testimonial user" 
              />
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-500">{t('visited')} April 2023</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['LANDSCAPE', 'ADVENTURE', 'HISTORY', 'EXCITING', 'CULTURE'].map((tag) => (
              <span 
                key={tag} 
                className="tag bg-travel-sky px-4 py-1 rounded-full text-white text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnmissableExperienceSection;
