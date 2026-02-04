"use client";

import React, { useState } from 'react';
import { Booking } from '@/app/admin/bookings.service';
import CancelBookingModal from './CancelBookingModal';

interface CancelBookingTriggerProps {
  booking: Booking;
}

const CancelBookingTrigger: React.FC<CancelBookingTriggerProps> = ({ booking }) => {
  const [showModal, setShowModal] = useState(false);

  if (booking.status !== 'upcoming' && booking.status !== 'ongoing') {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Cancel Booking
      </button>

      {showModal && (
        <CancelBookingModal 
          booking={booking} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default CancelBookingTrigger;
