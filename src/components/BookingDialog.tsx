
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';

// Define form schema
const bookingFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tourName: string;
  tourDate: string;
  guestCount: number;
  totalPrice: number;
}

const BookingDialog = ({ isOpen, onClose, tourName, tourDate, guestCount, totalPrice }: BookingDialogProps) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });

  const handleSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create a simple message body with booking details
      const messageBody = `
        New Tour Booking:
        
        Tour: ${tourName}
        Date: ${tourDate}
        Guests: ${guestCount}
        Total Price: $${totalPrice}
        
        Customer Details:
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        Special Requests: ${data.specialRequests || 'None'}
        
        Booking Time: ${new Date().toLocaleString()}
      `;
      
      // Updated EmailJS parameters
      const emailData = {
        service_id: 'service_yg4aaen', // Your provided service ID
        user_id: 't4RuxgnErfpFwntGa', // Your provided public key
        template_params: {
          to_email: 'artyomananov@gmail.com', // Updated to your email address
          from_name: data.name,
          message: messageBody,
          reply_to: data.email,
        },
      };

      console.log("Booking Data:", messageBody);
      
      // Using the standard EmailJS API endpoint
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      toast({
        title: t("booking_successful"),
        description: t("booking_confirmed"),
      });
      
      onClose();
      form.reset();
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: t("booking_failed"),
        description: t("please_try_again"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("complete_your_booking")}</DialogTitle>
          <DialogDescription>
            {t("booking_for")} {tourName} - {tourDate}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("full_name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enter_your_name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone_number")}</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 8900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("special_requests")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("any_special_requests")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button 
                type="submit"
                className="bg-travel-coral hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  t("confirm_booking")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
