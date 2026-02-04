"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Booking, AdminBookings } from '@/app/admin/bookings.service';
import { useRouter } from 'next/navigation';

interface CancelBookingModalProps {
  booking: Booking;
  onClose: () => void;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({ booking, onClose }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(booking.payment.amount.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirmCancelBooking = async () => {
    setIsSubmitting(true);
    try {
      const result = await AdminBookings.cancel(
        booking.id,
        cancelReason,
        parseFloat(refundAmount)
      );
      
      if (result.success) {
        toast.success('Booking cancelled successfully');
        onClose();
        router.refresh(); 
      } else {
        toast.error(result.message || 'Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || 'An error occurred while cancelling the booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Gradient Header */}
        <div className="relative p-6 bg-linear-to-br from-red-500 to-orange-500 text-white overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Cancel Booking</h3>
              <p className="text-sm text-white/80">This action requires confirmation</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl space-y-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Booking Number</span>
              <span className="font-bold text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                {booking.bookingNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Course</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {booking.course.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Session Date</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatDate(booking.session.date)} at {formatTime(booking.session.time)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Paid Amount</span>
              <span className="text-lg font-bold bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ${booking.payment.amount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Refund Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 ml-1">
                Refund Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
                  $
                </span>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  max={booking.payment.amount}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold shadow-inner"
                />
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 ml-1">
                Max refund: ${booking.payment.amount.toFixed(2)}
              </p>
            </div>

            {/* Cancellation Reason */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 ml-1">
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason..."
                rows={1}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl flex gap-3">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-orange-800 dark:text-orange-400 leading-relaxed font-medium">
              Student and tutor will be notified. Refund will be processed in 5-7 business days.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95 border border-gray-200 dark:border-gray-600"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={confirmCancelBooking}
              disabled={!cancelReason.trim() || !refundAmount || isSubmitting}
              className="flex-1 px-6 py-3 bg-linear-to-br from-red-600 to-orange-600 text-white font-bold rounded-2xl hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/30 active:scale-95"
            >
              {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CancelBookingModal;
