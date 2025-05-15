
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import TourForm from './TourForm';

// Initial demo data
const initialTours = [
  {
    id: "1",
    name: "The Grand Resort",
    location: "East Barrett",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    category: "Featured",
    description: "Experience the beauty of Lombok with our exclusive package at The Grand Resort.",
    rating: 4.8,
    originalPrice: 499,
    discountPrice: 288,
    dates: {
      start: new Date(2023, 6, 20),
      end: new Date(2023, 6, 23)
    },
    participants: 4
  },
  {
    id: "2",
    name: "Beach Paradise",
    location: "Steuberbury",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    category: "Family-friendly",
    description: "Perfect getaway for families looking for relaxation and fun activities.",
    rating: 4.7,
    originalPrice: 355,
    discountPrice: 287,
    dates: {
      start: new Date(2023, 7, 15),
      end: new Date(2023, 7, 20)
    },
    participants: 6
  },
];

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
  dates: {
    start: Date;
    end: Date;
  };
  participants?: number;
};

const AdminTourPanel: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const navigate = useNavigate();

  const handleAddTour = (tour: Omit<Tour, 'id'>) => {
    const newTour = {
      ...tour,
      id: Math.random().toString(36).substring(2, 9),
      rating: 5.0, // Default rating for new tours
    };
    
    setTours([...tours, newTour as Tour]);
    setIsAddingTour(false);
    toast({
      title: "Tour Added",
      description: `${tour.name} has been added successfully.`,
    });
  };

  const handleUpdateTour = (updatedTour: Tour) => {
    setTours(tours.map(tour => tour.id === updatedTour.id ? updatedTour : tour));
    setEditingTour(null);
    toast({
      title: "Tour Updated",
      description: `${updatedTour.name} has been updated successfully.`,
    });
  };

  const handleDeleteTour = (id: string) => {
    const tourToDelete = tours.find(tour => tour.id === id);
    setTours(tours.filter(tour => tour.id !== id));
    toast({
      title: "Tour Deleted",
      description: `${tourToDelete?.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Admin Tour Management</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {(isAddingTour || editingTour) ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingTour ? 'Edit Tour' : 'Add New Tour'}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingTour(false);
                  setEditingTour(null);
                }}
              >
                Cancel
              </Button>
            </div>
            <TourForm 
              tour={editingTour} 
              onSubmit={editingTour ? handleUpdateTour : handleAddTour} 
            />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Tour Listings</h2>
              <Button onClick={() => setIsAddingTour(true)}>
                <Plus size={16} className="mr-2" /> Add New Tour
              </Button>
            </div>

            {/* Tour listing table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tour
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tours.map((tour) => (
                      <tr key={tour.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={tour.image}
                                alt={tour.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{tour.name}</div>
                              <div className="text-sm text-gray-500">
                                {format(tour.dates.start, "MMM d")} - {format(tour.dates.end, "MMM d, yyyy")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tour.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tour.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${tour.discountPrice ? (
                              <>
                                <span className="font-medium">{tour.discountPrice}</span>
                                <span className="ml-2 line-through text-gray-400">${tour.originalPrice}</span>
                              </>
                            ) : (
                              tour.originalPrice
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setEditingTour(tour)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteTour(tour.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {tours.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No tours found. Add your first tour!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTourPanel;
