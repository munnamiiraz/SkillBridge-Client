'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { 
  StudentDashboardService, 
  StudentProfile, 
  Booking, 
  DashboardStats 
} from '@/app/services/student-dashboard.service';

import { ProfileHeader } from './components/ProfileHeader';
import { StatsCards } from './components/StatsCards';
import { ProfileTabs } from './components/ProfileTabs';
import { OverviewTab } from './components/OverviewTab';
import { BookingsTab } from './components/BookingsTab';
import { ReviewsTab } from './components/ReviewsTab';

const StudentProfilePage: React.FC = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'reviews'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalSpent: 0,
    averageRating: '0.0'
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      
      try {
        setIsLoading(true);
        
        // Fetch profile and bookings in parallel
        const [profileData, bookingsData] = await Promise.all([
          StudentDashboardService.getProfile(),
          StudentDashboardService.getBookings()
        ]);
        
        setStudent(profileData);
        setBookings(bookingsData);
        
        // Calculate stats
        const calculatedStats = StudentDashboardService.calculateStats(bookingsData);
        setStats(calculatedStats);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) {
      fetchData();
    } else if (!sessionPending) {
      setIsLoading(false);
    }
  }, [session?.user?.id, sessionPending]);

  if (isLoading || sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
        <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        <ProfileHeader student={student} />
        
        <StatsCards stats={stats} />

        {/* Tabbed Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6 lg:p-8">
            {activeTab === 'overview' && (
              <OverviewTab student={student} stats={stats} />
            )}

            {activeTab === 'bookings' && (
              <BookingsTab bookings={bookings} />
            )}

            {activeTab === 'reviews' && (
              <ReviewsTab bookings={bookings} />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentProfilePage;