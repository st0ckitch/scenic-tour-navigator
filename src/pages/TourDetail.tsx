
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Users, MapPin, Star, Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { useTours } from '@/hooks/useTours';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "@/components/ui/use-toast";
import { Tour, TourImage } from '@/types/tour';

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tours, loading } = useTours();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Find tour when tours are loaded
  useEffect(() => {
    if (!loading && tours.length > 0 && id) {
      const foundTour = tours.find(t => t.id === id);
      if (foundTour) {
        setTour(foundTour);
        // Set the first image as selected or use the main image
        if (foundTour.images && foundTour.images.length > 0) {
          const mainImage = foundTour.images.find(img => img.isPrimary);
          setSelectedImage(mainImage ? mainImage.url : foundTour.images[0].url);
        } else if (foundTour.image) {
          setSelectedImage(foundTour.image);
        }
      }
    }
  }, [id, tours, loading]);

  // Handle booking button click
  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in or register to book this tour.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setBookingInProgress(true);
    
    // Simulate booking process
    setTimeout(() => {
      toast({
        title: "Booking Successful",
        description: "Your tour has been booked successfully!",
      });
      setBookingInProgress(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-travel-sky" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Tour Not Found</h1>
          <p className="mb-6">The tour you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/tours')}>Back to Tours</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get the translation for the current language or fall back to English
  const currentTranslation = tour.translations[language] || tour.translations.en;

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Hero Image */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img 
            src={selectedImage || tour.image || '/placeholder.svg'}
            alt={currentTranslation.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{currentTranslation.name}</h1>
              <div className="flex items-center text-lg">
                <MapPin className="mr-1 h-5 w-5" />
                <span>{currentTranslation.location}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tour Highlights Bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-travel-coral" />
                <span>
                  {format(tour.dates.start, "MMM d")} - {format(tour.dates.end, "MMM d, yyyy")}
                </span>
              </div>
              
              {tour.participants && (
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-travel-coral" />
                  <span>Max {tour.participants} participants</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-travel-coral" />
                <span>{tour.rating} rating</span>
              </div>
              
              <div className="flex items-center ml-auto">
                <span className="font-medium">
                  {tour.discountPrice ? (
                    <>
                      <span className="text-travel-coral">${tour.discountPrice}</span>
                      <span className="text-gray-400 line-through ml-2">${tour.originalPrice}</span>
                    </>
                  ) : (
                    <span className="text-travel-coral">${tour.originalPrice}</span>
                  )}
                  <span className="text-gray-500 text-sm"> per person</span>
                </span>
              </div>
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
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6 whitespace-pre-line">
                    {currentTranslation.longDescription || currentTranslation.description}
                  </p>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-3">What's Included</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {["Transportation", "Guided Tours", "WiFi", "Entrance Fees", 
                      "Special Access", "Photography Tips", "Cultural Experiences", "Welcome Gift"].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-travel-coral mr-2">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                
                {/* Main gallery image */}
                {selectedImage && (
                  <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={selectedImage}
                      alt={currentTranslation.name}
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Image thumbnails */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                  {/* Show tour images if available */}
                  {tour.images && tour.images.length > 0 ? (
                    tour.images.map((image) => (
                      <div 
                        key={image.id} 
                        className={`aspect-square overflow-hidden rounded-lg cursor-pointer border-2 ${selectedImage === image.url ? 'border-travel-coral' : 'border-transparent'}`}
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img 
                          src={image.url}
                          alt={`Tour thumbnail`}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                      </div>
                    ))
                  ) : tour.image ? (
                    // Single image if no multiple images
                    <div 
                      className={`aspect-square overflow-hidden rounded-lg cursor-pointer border-2 border-travel-coral`}
                    >
                      <img 
                        src={tour.image}
                        alt={`Tour image`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    // Placeholder if no images
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No images
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Booking */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-gray-500 line-through">${tour.originalPrice}</div>
                    <div className="text-travel-coral text-2xl font-bold">${tour.discountPrice || tour.originalPrice}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-medium">{tour.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">(124 reviews)</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 py-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Tour Dates</label>
                    <div className="flex items-center border rounded-md p-2">
                      <Calendar size={18} className="text-gray-400 mr-2" />
                      <span>
                        {format(tour.dates.start, "MMM d")} - {format(tour.dates.end, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Number of Guests</label>
                    <select className="w-full border rounded-md p-2">
                      <option>1 guest</option>
                      <option>2 guests</option>
                      <option selected>3 guests</option>
                      <option>4 guests</option>
                      {tour.participants && [...Array(tour.participants - 4)].map((_, i) => (
                        <option key={i + 5}>{i + 5} guests</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Price Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>${tour.discountPrice || tour.originalPrice} × 3 guests</span>
                        <span>${(tour.discountPrice || tour.originalPrice) * 3}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>$50</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                        <span>Total</span>
                        <span>${(tour.discountPrice || tour.originalPrice) * 3 + 50}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-travel-coral hover:bg-orange-600"
                    onClick={handleBookNow}
                    disabled={bookingInProgress}
                  >
                    {bookingInProgress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    {user ? "You won't be charged yet" : "Login required to book this tour"}
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
