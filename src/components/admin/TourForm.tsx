
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, ImageIcon, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/components/ui/use-toast";

type DateRangeType = {
  start: Date;
  end: Date;
};

type Tour = {
  id: string;
  name: string;
  location: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  originalPrice: number;
  discountPrice?: number;
  dates: DateRangeType;
  participants?: number;
};

type TourFormProps = {
  tour?: Tour | null;
  onSubmit: (tour: Omit<Tour, 'id' | 'rating'> & { id?: string, rating?: number }, imageFile?: File) => void;
};

const TourForm: React.FC<TourFormProps> = ({ tour, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: tour?.id || '',
    name: tour?.name || '',
    location: tour?.location || '',
    image: tour?.image || '',
    category: tour?.category || 'Featured',
    description: tour?.description || '',
    rating: tour?.rating || 5.0,
    originalPrice: tour?.originalPrice || 0,
    discountPrice: tour?.discountPrice || 0,
    dates: tour?.dates || {
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 3))
    },
    participants: tour?.participants || 0,
    hasDiscount: tour?.discountPrice ? true : false,
    hasParticipants: tour?.participants ? true : false
  });

  const [dateOpen, setDateOpen] = useState(false);
  const [dateType, setDateType] = useState<'start' | 'end'>('start');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(tour?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        dates: {
          ...formData.dates,
          [dateType]: date
        }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'originalPrice' || name === 'discountPrice' || name === 'participants'
        ? parseFloat(value) || 0
        : value
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    
    // Create preview URL for the selected image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // No need to set formData.image as we'll use the file directly
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      discountPrice: formData.hasDiscount ? formData.discountPrice : undefined,
      participants: formData.hasParticipants ? formData.participants : undefined
    };

    if (tour) {
      onSubmit({
        ...submissionData,
        id: tour.id,
        rating: tour.rating
      }, imageFile || undefined);
    } else {
      const { id, rating, ...newTourData } = submissionData;
      onSubmit(newTourData, imageFile || undefined);
    }
  };

  const categories = ['Featured', 'Family-friendly', 'On sale', 'Adventure', 'Relaxation', 'Cultural'];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tour Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter tour name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="Enter location"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter tour description"
              className="mt-1"
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Tour Image</Label>
            <div 
              className="mt-1 border-2 border-dashed rounded-md border-gray-300 p-4 cursor-pointer hover:border-gray-400 transition-colors"
              onClick={handleImageClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="relative">
                  <AspectRatio ratio={16 / 9} className="bg-muted">
                    <img
                      src={previewUrl}
                      alt="Tour preview"
                      className="rounded-md object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                    <div className="text-white flex flex-col items-center">
                      <Upload className="h-8 w-8 mb-1" />
                      <span>Change Image</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-md">
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-1" />
                  <p className="text-gray-500 text-sm">Click to upload an image</p>
                  <p className="text-gray-400 text-xs">JPG, PNG, GIF up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Tour Dates *</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Popover open={dateOpen && dateType === 'start'} onOpenChange={(open) => {
                  if (open) {
                    setDateType('start');
                  }
                  setDateOpen(open && dateType === 'start');
                }}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dates.start ? format(formData.dates.start, "PPP") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dates.start}
                      onSelect={(date) => {
                        handleDateSelect(date);
                        setDateOpen(false);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover open={dateOpen && dateType === 'end'} onOpenChange={(open) => {
                  if (open) {
                    setDateType('end');
                  }
                  setDateOpen(open && dateType === 'end');
                }}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dates.end ? format(formData.dates.end, "PPP") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dates.end}
                      onSelect={(date) => {
                        handleDateSelect(date);
                        setDateOpen(false);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="originalPrice">Original Price *</Label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  $
                </span>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="pl-7"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasDiscount" 
                checked={formData.hasDiscount}
                onCheckedChange={(checked) => 
                  setFormData({...formData, hasDiscount: checked === true})
                }
              />
              <label
                htmlFor="hasDiscount"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add discount price
              </label>
            </div>

            {formData.hasDiscount && (
              <div>
                <Label htmlFor="discountPrice">Discount Price</Label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required={formData.hasDiscount}
                    className="pl-7"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasParticipants" 
                checked={formData.hasParticipants}
                onCheckedChange={(checked) => 
                  setFormData({...formData, hasParticipants: checked === true})
                }
              />
              <label
                htmlFor="hasParticipants"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Specify maximum participants
              </label>
            </div>

            {formData.hasParticipants && (
              <div>
                <Label htmlFor="participants">Maximum Participants</Label>
                <Input
                  id="participants"
                  name="participants"
                  type="number"
                  value={formData.participants}
                  onChange={handleInputChange}
                  min="1"
                  required={formData.hasParticipants}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button type="submit" className="bg-travel-sky hover:bg-sky-600">
          {tour ? 'Update Tour' : 'Add Tour'}
        </Button>
      </div>
    </form>
  );
};

export default TourForm;
