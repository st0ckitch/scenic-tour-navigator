import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useTours } from '@/hooks/useTours';
import { useTourOperations } from '@/hooks/useTourOperations';
import TourForm from './TourForm';
import { Tour } from '@/types/tour';

const AdminPanel: React.FC = () => {
  const { tours, loading: loadingTours, refetch } = useTours();
  const { createTour, updateTour, deleteTour, loading: operationLoading } = useTourOperations();
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Handle adding a tour
  const handleAddTour = async (tourData: any, imageFiles?: File[]) => {
    try {
      const result = await createTour(tourData, imageFiles);
      if (result) {
        setIsAddingTour(false);
        refetch();
      }
    } catch (error) {
      console.error("Error adding tour:", error);
    }
  };

  // Handle updating a tour
  const handleUpdateTour = async (tourData: any, imageFiles?: File[]) => {
    try {
      const success = await updateTour(tourData, imageFiles);
      if (success) {
        setEditingTour(null);
        refetch();
      }
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  };

  // Handle deleting a tour
  const handleDeleteTour = async (id: string) => {
    const tourToDelete = tours.find(tour => tour.id === id);
    if (!tourToDelete) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete "${tourToDelete.translations.en.name}"?`);
    if (!confirmed) return;
    
    const success = await deleteTour(id, tourToDelete.translations.en.name);
    if (success) {
      refetch();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Error",
        description: "There was an error during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show form or tour list
  const showForm = isAddingTour || editingTour !== null;
  
  // Submit handler - unified for add and edit
  const handleSubmit = async (tourData: any, imageFiles?: File[]) => {
    if (editingTour) {
      await handleUpdateTour(tourData, imageFiles);
    } else {
      await handleAddTour(tourData, imageFiles);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Tour Management</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {showForm ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingTour ? 'Edit Tour' : 'Add New Tour'}
              </h2>
            </div>
            
            <TourForm
              tour={editingTour || undefined}
              isSubmitting={operationLoading}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsAddingTour(false);
                setEditingTour(null);
              }}
            />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Tour Listings</h2>
              <Button 
                onClick={() => setIsAddingTour(true)} 
                disabled={operationLoading}
                className="bg-travel-coral hover:bg-orange-600 text-white"
              >
                <Plus size={16} className="mr-2" /> Add New Tour
              </Button>
            </div>

            {/* Loading state */}
            {loadingTours && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-travel-sky" />
                <span className="ml-2">Loading tours...</span>
              </div>
            )}

            {/* Tour listing table */}
            {!loadingTours && (
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
                                  src={tour.image || 'https://via.placeholder.com/40?text=No+Image'}
                                  alt={tour.translations.en.name}
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/40?text=No+Image';
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {tour.translations.en.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {format(tour.dates.start, "MMM d")} - {format(tour.dates.end, "MMM d, yyyy")}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tour.translations.en.location}
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
                                disabled={operationLoading}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteTour(tour.id)}
                                disabled={operationLoading}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {tours.length === 0 && !loadingTours && (
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

export default AdminPanel;
