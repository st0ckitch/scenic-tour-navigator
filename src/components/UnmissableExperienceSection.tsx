
import React from 'react';
import { Star } from 'lucide-react';

const UnmissableExperienceSection: React.FC = () => {
  // Array of images with location names and random rotation angles
  const experiencePhotos = [
    {
      src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
      location: "Kuta Beach",
      rotation: Math.floor(Math.random() * 16) - 8,
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      location: "Rinjani Mountain",
      rotation: Math.floor(Math.random() * 16) - 8,
    },
    {
      src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      location: "Sendang Gile",
      rotation: Math.floor(Math.random() * 16) - 8,
    },
    {
      src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80",
      location: "Gili Island",
      rotation: Math.floor(Math.random() * 16) - 8,
    },
  ];

  return (
    <section className="py-16 container mx-auto px-4 overflow-hidden">
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
              Unmissable Experiences in Lombok
            </h2>
            <p className="text-lg text-gray-600">
              Discover breathtaking views, pristine beaches, and unforgettable adventures
              that have captured the hearts of travelers from around the world.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-travel-sky">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-current" size={18} />
              ))}
              <span className="text-gray-700 font-medium ml-2">4.9/5 overall rating</span>
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
                <span className="text-travel-coral font-bold">150K</span> happy guests
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-600 italic mb-3">
              "The beaches in Lombok stole my heart. The serenity of the waves, the golden sands, 
              and the warm sun made every moment magical. A must-visit for anyone seeking paradise on earth!"
            </p>
            <div className="flex items-center">
              <img 
                className="w-10 h-10 rounded-full mr-3" 
                src="https://randomuser.me/api/portraits/women/32.jpg" 
                alt="Testimonial user" 
              />
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-500">Visited April 2023</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['LANDSCAPE', 'EXCURSION', 'JOURNEY', 'EXCITING', 'BEACH'].map((tag) => (
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
