
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

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
  onSubmit: (tour: Omit<Tour, 'id' | 'rating'> & { id?: string, rating?: number }) => void;
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
      });
    } else {
      const { id, rating, ...newTourData } = submissionData;
      onSubmit(newTourData);
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
            <Label htmlFor="image">Tour Image URL *</Label>
            <div className="mt-1 flex">
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
                placeholder="Enter image URL"
                className="flex-1"
              />
            </div>

            {formData.image && (
              <div className="mt-2 border rounded-md overflow-hidden h-32 bg-gray-50">
                <img
                  src={formData.image}
                  alt="Tour preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
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
