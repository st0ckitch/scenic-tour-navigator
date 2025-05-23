
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Loader2 } from "lucide-react";
import { useTours } from '@/hooks/useTours';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "@/components/ui/use-toast";
import { TourImage } from '@/types/tour';
import { format } from 'date-fns';
import BookingDialog from '@/components/BookingDialog';
import { Skeleton } from "@/components/ui/skeleton";

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tours, loading } = useTours();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [tour, setTour] = useState<any>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(3); // Default guest count
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [mainImageError, setMainImageError] = useState(false);
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState<Record<string, boolean>>({});

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
        // Reset loading states when tour changes
        setMainImageLoaded(false);
        setMainImageError(false);
        setThumbnailsLoaded({});
      }
    }
  }, [id, tours, loading, language]);

  const handleBookNow = () => {
    // Since we removed user authentication, we'll allow anyone to book now
    setBookingInProgress(true);
    
    // Open the booking dialog
    setIsBookingDialogOpen(true);
    setBookingInProgress(false);
  };

  const handleCloseBookingDialog = () => {
    setIsBookingDialogOpen(false);
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGuestCount(parseInt(e.target.value));
  };

  const handleThumbnailLoad = (imageId: string) => {
    setThumbnailsLoaded(prev => ({ ...prev, [imageId]: true }));
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
          {!mainImageLoaded && !mainImageError && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img 
            src={selectedImage || tour.image || '/placeholder.svg'}
            alt={currentTranslation.name}
            className={`w-full h-full object-cover ${!mainImageLoaded && !mainImageError ? 'invisible' : 'visible'}`}
            onLoad={() => setMainImageLoaded(true)}
            onError={(e) => {
              setMainImageError(true);
              setMainImageLoaded(true);
              e.currentTarget.src = '/placeholder.svg';
            }}
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
              {/* ... keep existing code (about this tour section) */}
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
                  {!mainImageLoaded && !mainImageError && (
                    <Skeleton className="w-full h-[400px]" />
                  )}
                  <img 
                    src={selectedImage || tour.image || '/placeholder.svg'}
                    alt={`Tour image`}
                    className={`w-full h-[400px] object-cover ${!mainImageLoaded && !mainImageError ? 'invisible' : 'visible'}`}
                    onLoad={() => setMainImageLoaded(true)}
                    onError={(e) => {
                      setMainImageError(true);
                      setMainImageLoaded(true);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Image thumbnails */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {tour.images && tour.images.length > 0 ? (
                    tour.images.map((image: TourImage) => (
                      <div 
                        key={image.id} 
                        className={`aspect-square overflow-hidden rounded-lg cursor-pointer border-2 ${selectedImage === image.url ? 'border-travel-coral' : 'border-transparent'}`}
                        onClick={() => {
                          setSelectedImage(image.url);
                          setMainImageLoaded(false);
                          setMainImageError(false);
                        }}
                      >
                        {!thumbnailsLoaded[image.id] && (
                          <Skeleton className="w-full h-full" />
                        )}
                        <img 
                          src={image.url}
                          alt={`Tour thumbnail`}
                          className={`w-full h-full object-cover hover:opacity-90 transition-opacity ${!thumbnailsLoaded[image.id] ? 'invisible' : 'visible'}`}
                          onLoad={() => handleThumbnailLoad(image.id)}
                          onError={(e) => {
                            handleThumbnailLoad(image.id);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    ))
                  ) : tour.image ? (
                    // If there are no additional images but there is a main image
                    <div className="aspect-square overflow-hidden rounded-lg cursor-pointer border-2 border-travel-coral">
                      {!mainImageLoaded && !mainImageError && (
                        <Skeleton className="w-full h-full" />
                      )}
                      <img 
                        src={tour.image}
                        alt={`Tour thumbnail`}
                        className={`w-full h-full object-cover ${!mainImageLoaded && !mainImageError ? 'invisible' : 'visible'}`}
                        onLoad={() => setMainImageLoaded(true)}
                        onError={(e) => {
                          setMainImageError(true);
                          setMainImageLoaded(true);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
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
                    {t("only_charged_checkout")}
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
