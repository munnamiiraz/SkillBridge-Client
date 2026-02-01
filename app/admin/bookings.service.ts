
export interface Booking {
  id: string;
  bookingNumber: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  tutor: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  course: {
    id: string;
    name: string;
    category: string;
  };
  session: {
    date: string;
    time: string;
    duration: number;
    type: 'video' | 'audio' | 'in-person';
  };
  payment: {
    amount: number;
    status: 'paid' | 'pending' | 'refunded' | 'failed';
    method: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  notes?: string;
}

export const AdminBookings = {
  
}