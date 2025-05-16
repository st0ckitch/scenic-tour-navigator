
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Loader2 } from "lucide-react";
import { useTours } from '@/hooks/useTours';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "@/components/ui/use-toast";
import { TourImage } from '@/types/tour';
import { format } from 'date-fns';
import BookingDialog from '@/components/BookingDialog';

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tours, loading } = useTours();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [tour, setTour] = useState<any>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(3); // Default guest count
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && id) {
      const foundTour = tours.find(t => t.id === id);
      if (foundTour) {
        setTour(foundTour);
        // Set initial selected image
        const mainImage = foundTour.images?.find((img: TourImage) => img.isMain)?.url;
        setSelectedImage(mainImage || foundTour.image);
      }
    }
  }, [id, tours, loading, language]);

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: t("authentication_required"),
        description: t("please_login_register"),
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setBookingInProgress(true);
    
    // Open the booking dialog instead of simulating the process
    setIsBookingDialogOpen(true);
    setBookingInProgress(false);
  };

  const handleCloseBookingDialog = () => {
    setIsBookingDialogOpen(false);
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGuestCount(parseInt(e.target.value));
  };

  // Calculate the tour dates string
  const getTourDates = () => {
    if (tour?.dates) {
      return `${format(new Date(tour.dates.start), "MMM d")} - ${format(new Date(tour.dates.end), "MMM d, yyyy")}`;
    }
    return "Select dates";
  };

  // Calculate the total price
  const calculateTotalPrice = () => {
    const basePrice = (tour?.discountPrice || tour?.originalPrice) * guestCount;
    const serviceFee = 50;
    return basePrice + serviceFee;
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
          <h1 className="text-3xl font-bold mb-4">{t("tour_not_found")}</h1>
          <p className="mb-6">{t("tour_not_exists")}</p>
          <Button onClick={() => navigate('/tours')}>{t("back_to_tours")}</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get the translation for the current language
  const currentTranslation = tour.translations[language];

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Hero Image */}
        <div className="relative h-96">
          <img 
            src={selectedImage || tour.image || '/placeholder.svg'}
            alt={currentTranslation.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-4xl font-bold mb-2">{currentTranslation.name}</h1>
              <p className="text-lg">{currentTranslation.location}</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tour Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">{t("about_this_tour")}</h2>
                <p className="text-gray-700 mb-4">
                  {currentTranslation.longDescription || currentTranslation.description}
                </p>
              </div>
              
              {/* Tour Gallery */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{t("gallery")}</h2>
                
                {/* Main gallery image */}
                <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={selectedImage || tour.image || '/placeholder.svg'}
                    alt={`Tour image`}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                
                {/* Image thumbnails */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {tour.images && tour.images.length > 0 ? (
                    tour.images.map((image: TourImage) => (
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
                    // If there are no additional images but there is a main image
                    <div 
                      className="aspect-square overflow-hidden rounded-lg cursor-pointer border-2 border-travel-coral"
                    >
                      <img 
                        src={tour.image}
                        alt={`Tour thumbnail`}
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
                    <label className="block text-gray-700 mb-2">{t("start_end_date")}</label>
                    <div className="flex items-center border rounded-md p-2">
                      <Calendar size={18} className="text-gray-400 mr-2" />
                      <span>
                        {tour.dates ? (
                          `${format(new Date(tour.dates.start), "MMM d")} - ${format(new Date(tour.dates.end), "MMM d, yyyy")}`
                        ) : "Select dates"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">{t("guests")}</label>
                    <select 
                      className="w-full border rounded-md p-2"
                      value={guestCount}
                      onChange={handleGuestChange}
                    >
                      <option value={1}>1 guest</option>
                      <option value={2}>2 guests</option>
                      <option value={3}>3 guests</option>
                      <option value={4}>4 guests</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">{t("price_details")}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>${tour.discountPrice || tour.originalPrice} {t("per_person")}</span>
                        <span>${(tour.discountPrice || tour.originalPrice) * guestCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("service_fee")}</span>
                        <span>$50</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                        <span>{t("total")}</span>
                        <span>${calculateTotalPrice()}</span>
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
                        {t("processing")}
                      </>
                    ) : (
                      t("book_now")
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    {user ? t("only_charged_checkout") : t("login_required")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Dialog */}
      <BookingDialog 
        isOpen={isBookingDialogOpen}
        onClose={handleCloseBookingDialog}
        tourName={currentTranslation.name}
        tourDate={getTourDates()}
        guestCount={guestCount}
        totalPrice={calculateTotalPrice()}
      />
      
      <Footer />
    </>
  );
};

export default TourDetail;
