
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";

const TourDetail = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Hero Image */}
        <div className="relative h-96">
          <img 
            src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80"
            alt="The Grand Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-4xl font-bold mb-2">The Grand Resort</h1>
              <p className="text-lg">East Barrett, Lombok</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tour Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
                <p className="text-gray-700 mb-4">
                  Experience the beauty of Lombok with our exclusive package at The Grand Resort. 
                  Located directly on the pristine beaches of East Barrett, this luxury resort offers 
                  stunning ocean views, world-class amenities, and easy access to local attractions.
                </p>
                
                <p className="text-gray-700 mb-4">
                  During your stay, enjoy complimentary breakfast, access to our infinity pool 
                  overlooking the ocean, and daily yoga sessions on the beach. Our staff will 
                  help arrange excursions to nearby islands, snorkeling tours, and cultural activities.
                </p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-3">Included Amenities</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {["Airport Transfers", "Daily Breakfast", "WiFi", "Beach Access", 
                      "Pool Access", "Fitness Center", "Daily Activities", "Welcome Drink"].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-travel-coral mr-2">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((image) => (
                    <div key={image} className="aspect-square overflow-hidden rounded-lg">
                      <img 
                        src={`https://images.unsplash.com/photo-${1500000000000 + image * 10000}?auto=format&fit=crop&w=500&q=80`}
                        alt={`Resort image ${image}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Booking */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-gray-500 line-through">$499</div>
                    <div className="text-travel-coral text-2xl font-bold">$288</div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-medium">4.8</span>
                    <span className="text-gray-500 text-sm ml-1">(124 reviews)</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 py-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Check-in / Check-out</label>
                    <div className="flex items-center border rounded-md p-2">
                      <Calendar size={18} className="text-gray-400 mr-2" />
                      <span>Tue, Jul 20 - Fri, Jul 23</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Guests</label>
                    <select className="w-full border rounded-md p-2">
                      <option>1 guest</option>
                      <option>2 guests</option>
                      <option selected>3 guests</option>
                      <option>4 guests</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Price Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>$288 x 3 nights</span>
                        <span>$864</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resort fee</span>
                        <span>$45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>$50</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                        <span>Total</span>
                        <span>$959</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-travel-coral hover:bg-orange-600">
                    Book Now
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TourDetail;
