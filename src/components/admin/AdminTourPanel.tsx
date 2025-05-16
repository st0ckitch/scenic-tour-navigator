import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import TourForm from './TourForm';
import { useTours } from '@/contexts/ToursContext';

const AdminTourPanel: React.FC = () => {
  const { tours, loading, addTour, updateTour, deleteTour } = useTours();
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [editingTour, setEditingTour] = useState<typeof tours[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleAddTour = async (tour: Omit<typeof tours[0], 'id'>, imageFile?: File) => {
    setIsProcessing(true);
    try {
      await addTour(tour, imageFile);
      setIsAddingTour(false);
      toast({
        title: "Tour Added",
        description: `${tour.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding tour:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateTour = async (updatedTour: typeof tours[0], imageFile?: File) => {
    setIsProcessing(true);
    try {
      await updateTour(updatedTour, imageFile);
      setEditingTour(null);
      toast({
        title: "Tour Updated",
        description: `${updatedTour.name} has been updated successfully.`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTour = async (id: string) => {
    const tourToDelete = tours.find(tour => tour.id === id);
    if (!tourToDelete) return;
    
    setIsProcessing(true);
    try {
      await deleteTour(id);
      toast({
        title: "Tour Deleted",
        description: `${tourToDelete.name} has been deleted.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
                disabled={isProcessing}
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
              <Button onClick={() => setIsAddingTour(true)} disabled={isProcessing}>
                <Plus size={16} className="mr-2" /> Add New Tour
              </Button>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-travel-sky" />
                <span className="ml-2">Loading tours...</span>
              </div>
            )}

            {/* Tour listing table */}
            {!loading && (
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
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/40?text=No+Image';
                                  }}
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
                                disabled={isProcessing}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteTour(tour.id)}
                                disabled={isProcessing}
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
                
                {tours.length === 0 && !loading && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No tours found. Add your first tour!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTourPanel;
