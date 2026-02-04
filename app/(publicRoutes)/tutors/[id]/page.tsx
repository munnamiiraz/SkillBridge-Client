'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { TutorProfileInfo, TutorBookingCard } from '@/components/tutor-profile/TutorProfileHeader';
import { TutorAboutContent, TutorQuickStatsSidebar } from '@/components/tutor-profile/TutorAboutAndSubjects';
import TutorAvailabilityReviewsCTA from '@/components/tutor-profile/TutorAvailabilityReviewsCTA';
import { Loader2 } from 'lucide-react';

const TutorProfilePage: React.FC = () => {
    const params = useParams();
    const tutorId = params?.id as string;
    const [tutorData, setTutorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!tutorId) return;

        const fetchTutorProfile = async () => {
            try {
                // Fetch public tutor profile info
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/public/tutors/${tutorId}`);
                if (response.data.success) {
                    const data = response.data.data;
                    
                    const user = data.user;
                    
                    // Fetch recent reviews
                    let recentReviews = [];
                    let ratingBreakdown = [5, 4, 3, 2, 1].map(stars => ({
                        stars,
                        count: 0,
                        percentage: 0,
                    }));
                    let statsRes;
                    try {
                        // Fetch rating statistics
                        statsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/public/tutors/${tutorId}/rating-stats`);
                        //  console.log(statsRes);
                        
                        if (statsRes.data.success) {
                            ratingBreakdown = statsRes.data.data.distribution.map((d: any) => ({
                                stars: d.rating,
                                count: d.count,
                                percentage: d.percentage,
                            }));

                            
                        }
                    } catch (statsErr) {
                        console.error('Error fetching rating stats:', statsErr);
                    }
                    
                    try {
                        const reviewsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/public/reviews?tutorProfileId=${data.id}&limit=5`);
                        if (reviewsRes.data.success) {
                            recentReviews = reviewsRes.data.data.map((r: any) => ({
                                name: r.user.name,
                                avatar: r.user.image || r.user.name.charAt(0).toUpperCase(),
                                rating: r.rating,
                                date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                subject: r.booking?.subject || 'Learning Session',
                                review: r.comment,
                                verified: true
                            }));
                        }
                    } catch (reviewErr) {
                        console.error('Error fetching reviews:', reviewErr);
                    }

                    // Transform backend data to frontend structure
                    const mappedData = {
                        header: {
                            id: data.id,
                            userId: user.id,
                            name: user.name,
                            avatar: user.image || (user.name ? user.name.charAt(0).toUpperCase() : '?'),
                            primarySubjects: data.tutor_subject?.map((ts: any) => ts.subject.name) || [],
                            tagline: data.headline || 'Experienced Tutor',
                            rating: statsRes?.data.data.averageRating || 0,
                            reviewCount: statsRes?.data.data.totalReviews || 0,
                            totalStudents: 0, // Not typically active field yet
                            responseTime: '< 2 hours', // Placeholder or calculated if available
                            pricePerSession: data.hourlyRate,
                            sessionDuration: '60 min',
                            availability: data.isAvailable ? 'Available Today' : 'Unavailable',
                            isAvailable: data.isAvailable,
                            verified: user.emailVerified,
                            bgGradient: 'from-indigo-500 to-purple-500',
                        },
                        about: {
                            bio: data.bio || 'No bio available.',
                            teachingStyle: [
                                {
                                    title: 'Student-Centered Learning',
                                    description: 'I adapt my teaching methods to match your learning style and pace.',
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ),
                                },
                            ],
                            experience: [
                                {
                                    role: 'Education',
                                    organization: data.education || 'University Name',
                                    year: 'Graduate',
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                        </svg>
                                    ),
                                },
                                {
                                    role: 'Experience',
                                    organization: `${data.experience || 0} Years`,
                                    year: 'Total',
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    ),
                                }
                            ],
                        },
                        subjects: [
                            // Mock categories if backend doesn't return structured skills yet or map flat list
                            {
                                category: 'Expertise',
                                skills: (data.tutor_subject || []).map((ts: any) => ({ name: ts.subject.name, level: 'Expert' }))
                            }
                        ],
                        availability: {
                            timezone: 'EST (UTC-5)',
                            weekSchedule: (() => {
                                const schedule = [];
                                const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                const today = new Date();
                                
                                for (let i = 0; i < 7; i++) {
                                    const date = new Date(today);
                                    date.setDate(today.getDate() + i);
                                    
                                    const dayIdx = date.getDay();
                                    const dayOfWeekInt = dayIdx === 0 ? 7 : dayIdx;
                                    
                                    const slots = (data.availability_slot || [])
                                        .filter((s: any) => s.dayOfWeek === dayOfWeekInt && !s.isBooked)
                                        .map((s: any) => s.startTime);
                                        
                                    schedule.push({
                                        day: `${shortDays[dayIdx]} ${date.getDate()}`,
                                        slots,
                                        available: slots.length > 0,
                                    });
                                }
                                return schedule;
                            })(),
                        },
                        reviews: {
                            stats: {
                                averageRating: statsRes?.data.data.averageRating || 0,
                                totalReviews: statsRes?.data.data.totalReviews || 0,
                                breakdown: ratingBreakdown,
                            },
                            recent: recentReviews,
                        },
                        summary: {
                            id: data.id,
                            name: user.name,
                            subjects: data.tutor_subject?.map((ts: any) => ts.subject.name).join(' & ') || 'Tutor',
                            experience: `${data.experience} years`,
                            students: data.totalSessions || 0,
                            rating: data.averageRating,
                        },
                    };
                    setTutorData(mappedData);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching tutor profile:', err);
                setError(true);
                // toast.error('Failed to load tutor profile');
            } finally {
                setLoading(false);
            }
        };

        fetchTutorProfile();
    }, [tutorId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !tutorData) {
        return notFound();
    }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column - Core Information */}
            <div className="lg:col-span-2 space-y-12">
              <TutorProfileInfo tutor={tutorData.header} />
              <TutorAboutContent 
                about={tutorData.about} 
                subjects={tutorData.subjects} 
              />
            </div>

            {/* Right Column - Unified Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <TutorBookingCard tutor={tutorData.header} />
                <TutorQuickStatsSidebar />
                
                {/* Quick Info Below Card */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 text-center">
                    🎉 <span className="font-semibold">First session 50% off</span> for new students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TutorAvailabilityReviewsCTA 
        availability={tutorData.availability}
        reviewStats={tutorData.reviews.stats}
        recentReviews={tutorData.reviews.recent}
        tutorSummary={tutorData.summary}
      />
    </div>
  );
};

export default TutorProfilePage;