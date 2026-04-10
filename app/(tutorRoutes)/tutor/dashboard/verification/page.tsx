'use client';

import React, { useState, useEffect } from 'react';
import { getTutorProfileDetail, requestVerification } from '@/app/services/tutor-profile.service';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle, Award, Star, BookOpen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const VerificationPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const fetchProfile = async () => {
    const { data, error } = await getTutorProfileDetail();
    if (data) setProfile(data);
    else toast.error(error?.message || 'Failed to load profile');
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRequest = async () => {
    setRequesting(true);
    const { data, error } = await requestVerification();
    if (data) {
      toast.success('Verification request submitted successfully!');
      fetchProfile();
    } else {
      toast.error(error?.message || 'Failed to submit request');
    }
    setRequesting(false);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const sessionGoal = 10;
  const progress = Math.min((profile.totalSessions / sessionGoal) * 100, 100);
  const isEligible = profile.totalSessions >= sessionGoal;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 shadow-inner">
          <Award className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          Tutor Verification Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Elevate your teaching career. Verified tutors get <span className="text-indigo-600 dark:text-indigo-400 font-bold">3x more bookings</span> and top placement in search results.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Current Status Card */}
        <div className={`relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-500 ${
          profile.isVerified 
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' 
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                profile.isVerified ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}>
                {profile.isVerified ? <ShieldCheck className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Current Status: {profile.isVerified ? 'Verified Expert' : 'Standard Tutor'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.isVerified 
                    ? 'Congratulations! You are a trusted member of our community.' 
                    : 'Complete the requirements below to unlock your verified badge.'}
                </p>
              </div>
            </div>
            {!profile.isVerified && (
              <Button 
                onClick={handleRequest}
                disabled={!isEligible || requesting}
                className={`h-14 px-10 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 ${
                  isEligible 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                }`}
              >
                {requesting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Request Verification'}
              </Button>
            )}
          </div>
          {/* Decorative Background */}
          {profile.isVerified && (
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Award className="w-48 h-48 rotate-12" />
            </div>
          )}
        </div>

        {/* Requirements Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Requirement 1: Sessions */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-6 h-6" />
                </span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  progress >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {profile.totalSessions} / {sessionGoal}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">10 Completed Sessions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Gain experience by completing at least 10 sessions with students.
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-right text-gray-500">{Math.round(progress)}% Complete</p>
            </div>
          </div>

          {/* Requirement 2: Rating */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                <Star className="w-6 h-6" />
              </span>
              <span className="text-sm font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                Min 4.5 Rating
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Quality Performance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Maintain a high average rating. Your current rating is <span className="font-bold text-gray-900 dark:text-white">{profile.averageRating}</span>.
            </p>
          </div>
        </div>

        {/* Perks Section */}
        <div className="mt-8 p-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl text-white">
          <h3 className="text-2xl font-bold mb-8">Verification Perks</h3>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                < Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold">Search Boost</h4>
              <p className="text-sm text-indigo-100">Appear at the top of all search results instantly.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold">Trust Badge</h4>
              <p className="text-sm text-indigo-100">A visible blue checkmark on your profile and cards.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold">Premium Support</h4>
              <p className="text-sm text-indigo-100">Priority assistance from our dedicated support team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
