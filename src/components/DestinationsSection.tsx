
import React from 'react';

type DestinationCardProps = {
  name: string;
  location: string;
  image: string;
};

const DestinationCard: React.FC<DestinationCardProps> = ({ name, location, image }) => {
  return (
    <div className="tour-card group">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="tour-image group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-4 left-4">
          <span className="tag bg-travel-coral">Lombok Beach</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-gray-600">{location}</p>
      </div>
    </div>
  );
};

const DestinationsSection: React.FC = () => {
  const destinations = [
    {
      name: "Gili Nanggu",
      location: "Lombok, Indonesia",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Gili Kondo",
      location: "Lombok, Indonesia",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Gili Trawangan",
      location: "Lombok, Indonesia",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"
    }
  ];
  
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-travel-coral font-medium">From 2024</p>
          <h2 className="text-3xl md:text-4xl font-bold">An Unmissable Experience</h2>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-travel-coral hover:text-white hover:border-travel-coral transition-colors">
            ←
          </button>
          <button className="w-10 h-10 bg-travel-coral text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
            →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((destination, index) => (
          <DestinationCard key={index} {...destination} />
        ))}
      </div>
    </section>
  );
};

export default DestinationsSection;
