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
