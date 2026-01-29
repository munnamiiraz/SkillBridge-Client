'use client';

import React, { useState } from 'react';

interface TutorAvailabilityReviewsCTAProps {
  availability: {
    timezone: string;
    weekSchedule: {
      day: string;
      slots: string[];
      available: boolean;
    }[];
  };
  reviewStats: {
    averageRating: number;
    totalReviews: number;
    breakdown: {
      stars: number;
      count: number;
      percentage: number;
    }[];
  };
  recentReviews: {
    name: string;
    avatar: string;
    rating: number;
    date: string;
    subject: string;
    review: string;
    verified: boolean;
  }[];
  tutorSummary: {
    name: string;
    subjects: string;
    experience: string;
    students: number;
    rating: number;
  };
}

const TutorAvailabilityReviewsCTA: React.FC<TutorAvailabilityReviewsCTAProps> = ({
  availability,
  reviewStats,
  recentReviews,
  tutorSummary,
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  return (
    <section className="relative w-full bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">
        
        {/* Availability Preview Section */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Availability This Week
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Timezone: <span className="font-semibold text-gray-900 dark:text-white">{availability.timezone}</span>
                </p>
              </div>
            </div>

            {/* Weekly Grid */}
            <div className="grid grid-cols-7 gap-3">
              {availability.weekSchedule.map((dayData, index) => (
                <div
                  key={index}
                  onClick={() => dayData.available && setSelectedDay(dayData.day)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    dayData.available
                      ? selectedDay === dayData.day
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Day */}
                  <div className="text-center mb-3">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      {dayData.day}
                    </div>
                    <div className={`text-2xl font-bold ${
                      dayData.available 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-400 dark:text-gray-600'
                    }`}>
                      {dayData.slots.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {dayData.slots.length === 1 ? 'slot' : 'slots'}
                    </div>
                  </div>

                  {/* Availability Indicator */}
                  {dayData.available ? (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-600 transform -rotate-45">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Day Time Slots */}
            {selectedDay && (
              <div className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Available Times - {selectedDay}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availability.weekSchedule
                    .find(d => d.day === selectedDay)
                    ?.slots.map((slot, index) => (
                      <button
                        key={index}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-lg font-semibold text-gray-900 dark:text-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                      >
                        {slot}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* View Full Calendar Button */}
            <div className="flex justify-center pt-4">
              <button className="group inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Full Schedule
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10H16M16 10L11 5M16 10L11 15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column - Quick Booking Reminder */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Book Quickly
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Popular time slots fill up fast. Secure your preferred session time today.
                </p>
              </div>
              <button className="w-full py-3 bg-linear-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews & Ratings Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Student Reviews
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {reviewStats.totalReviews} verified student reviews
              </p>
            </div>
          </div>

          {/* Rating Overview */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Overall Rating */}
            <div className="text-center p-8 bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800">
              <div className="text-6xl font-bold bg-linear-to-br from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
                {reviewStats.averageRating}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">
                Based on {reviewStats.totalReviews} reviews
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="md:col-span-2 space-y-3">
              {reviewStats.breakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.stars}</span>
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="space-y-6 mt-8">
            {recentReviews.map((review, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {review.avatar}
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                          {review.verified && (
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{review.date} · {review.subject}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.review}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Reviews Button */}
          <div className="flex justify-center pt-4">
            <button className="group inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg">
              View All {reviewStats.totalReviews} Reviews
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10H16M16 10L11 5M16 10L11 15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Conversion Section */}
        <div className="relative mt-16 p-12 lg:p-16 bg-linear-to-br from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-3xl shadow-2xl overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Tutor Summary */}
            <div className="text-white space-y-4">
              <h3 className="text-3xl lg:text-4xl font-bold">
                Ready to start learning with {tutorSummary.name.split(' ')[1]}?
              </h3>
              <div className="space-y-2 text-white/90">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">{tutorSummary.subjects}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{tutorSummary.experience} of teaching experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{tutorSummary.students}+ successful students</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span>{tutorSummary.rating} average rating</span>
                </div>
              </div>
            </div>

            {/* Right - CTA */}
            <div className="space-y-4">
              <button className="w-full py-5 bg-white hover:bg-gray-50 text-indigo-600 font-bold text-lg rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Your First Session
              </button>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send a Message
              </button>
              <p className="text-center text-white/80 text-sm">
                💡 First session is 50% off for new students
              </p>
            </div>
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
    </section>
  );
};

export default TutorAvailabilityReviewsCTA;
