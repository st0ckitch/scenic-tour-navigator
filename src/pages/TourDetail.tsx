
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Loader2 } from "lucide-react";
import { useTours } from '@/contexts/ToursContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tours, loading } = useTours();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tour, setTour] = useState<any>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && id) {
      const foundTour = tours.find(t => t.id === id);
      if (foundTour) {
        setTour(foundTour);
      }
    }
  }, [id, tours, loading]);

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login or register to book this tour",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setBookingInProgress(true);
    
    // Simulate booking process
    setTimeout(() => {
      toast({
        title: "Booking successful",
        description: "Your booking has been confirmed!",
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
          <h1 className="text-3xl font-bold mb-4">Tour not found</h1>
          <p className="mb-6">The tour you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/tours')}>Back to Tours</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Hero Image */}
        <div className="relative h-96">
          <img 
            src={tour.image}
            alt={tour.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-4xl font-bold mb-2">{tour.name}</h1>
              <p className="text-lg">{tour.location}</p>
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
                  {tour.description || "Experience the beauty of this destination with our exclusive package. Located in a prime area, this tour offers stunning views, world-class amenities, and easy access to local attractions."}
                </p>
                
                <p className="text-gray-700 mb-4">
                  During your tour, enjoy complimentary activities, access to special locations, and guided experiences. Our staff will help arrange excursions to nearby points of interest, local cuisine tasting, and cultural activities.
                </p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-3">Included Amenities</h3>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((image) => (
                    <div key={image} className="aspect-square overflow-hidden rounded-lg">
                      <img 
                        src={tour.image}
                        alt={`Tour image ${image}`}
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
                    <label className="block text-gray-700 mb-2">Start / End Date</label>
                    <div className="flex items-center border rounded-md p-2">
                      <Calendar size={18} className="text-gray-400 mr-2" />
                      <span>
                        {tour.dates ? (
                          `${new Date(tour.dates.start).toLocaleDateString()} - ${new Date(tour.dates.end).toLocaleDateString()}`
                        ) : "Select dates"}
                      </span>
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
                        <span>${tour.discountPrice || tour.originalPrice} per person</span>
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
                      'Book Now'
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    {user ? "You'll only be charged at checkout" : "Login required for booking"}
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
