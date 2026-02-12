'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cancelStudentBooking, submitStudentReview, Booking } from '@/app/services/booking.service';
import { BookingList } from './BookingList';
import { ReviewModal } from './ReviewModal';

interface ClientWrapperProps {
  bookings: Booking[];
  activeTab: string;
}

export const ClientWrapper: React.FC<ClientWrapperProps> = ({ bookings, activeTab }) => {
  const router = useRouter();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancellingId, setIsCancellingId] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setIsCancellingId(bookingId);
      const result = await cancelStudentBooking(bookingId);
      
      if (result.data?.success) {
        toast.success('Booking cancelled successfully');
        router.refresh();
      } else {
        toast.error(result.error?.message || result.data?.message || 'Failed to cancel booking');
      }
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsCancellingId(null);
    }
  };

  const handleLeaveReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (selectedBooking) {
      try {
        const result = await submitStudentReview(selectedBooking.id, rating, comment);
        
        if (result.data?.success) {
          toast.success("Review submitted successfully!");
          setShowReviewModal(false);
          setSelectedBooking(null);
          router.refresh();
        } else {
          toast.error(result.error?.message || result.data?.message || 'Failed to submit review');
        }
      } catch (err: any) {
        console.error('Error submitting review:', err);
        toast.error('Failed to submit review');
        throw err;
      }
    }
  };

  return (
    <>
      <BookingList 
        bookings={bookings} 
        loading={false}
        error={null}
        onCancel={handleCancelBooking}
        onReview={handleLeaveReview}
        isCancellingId={isCancellingId}
        activeTab={activeTab as any}
      />

      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        booking={selectedBooking}
      />
    </>
  );
};
