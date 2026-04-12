'use client';

import React, { useState, useEffect } from 'react';
import { getUnverifiedTutors, verifyTutor } from '@/app/admin/tutors.service';
import { toast } from 'sonner';
import { Loader2, CheckCircle, ShieldCheck, User, Clock, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const AdminVerificationsPage = () => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchTutors = async () => {
    setLoading(true);
    const { data, error } = await getUnverifiedTutors();
    if (data) {
      // Filter for tutors who aren't verified yet but might have requested it
      setTutors(data.filter((u: any) => u.role === 'TUTOR' || u.role === 'VERIFIED_TUTOR'));
    } else {
      toast.error(error?.message || 'Failed to load tutors');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleVerify = async (tutorProfileId: string) => {
    if (!tutorProfileId) {
      toast.error("Tutor Profile ID missing");
      return;
    }
    setProcessingId(tutorProfileId);
    const { data, error } = await verifyTutor(tutorProfileId);
    if (data) {
      toast.success('Tutor verified successfully!');
      fetchTutors();
    } else {
      toast.error(error?.message || 'Verification failed');
    }
    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Tutor Verification Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Review and approve experienced tutors for the <span className="text-indigo-600 font-bold">Verified Expert</span> badge.
          </p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800">
          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
            Pending Review: {tutors.filter(t => t.role === 'TUTOR').length}
          </p>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid gap-6">
        {tutors.length > 0 ? (
          tutors.map((tutor) => (
            <div 
              key={tutor.id} 
              className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-700 overflow-hidden relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Profile Pic & Basic Info */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {tutor.name.charAt(0)}
                    </div>
                    {tutor.role === 'VERIFIED_TUTOR' && (
                      <div className="absolute -right-2 -bottom-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white dark:border-gray-900 shadow-md">
                        < ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {tutor.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{tutor.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        tutor.role === 'VERIFIED_TUTOR' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tutor.role === 'VERIFIED_TUTOR' ? 'Verified' : 'Standard'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-bold">
                        <Clock className="w-3 h-3" />
                         Joined {new Date(tutor.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 py-4 lg:py-0 px-2 lg:px-8 border-y lg:border-y-0 lg:border-x border-gray-100 dark:border-gray-800">
                  <div className="text-center lg:text-left">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sessions</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">12+</p> 
                    {/* Note: Ideally we'd pass sessions from backend in users list */}
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">4.9</p>
                  </div>
                  <div className="text-center lg:text-left hidden sm:block">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Impact</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">High</p>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3 lg:w-72 justify-end">
                   <Link 
                    href={`/tutors/${tutor.tutorProfileId || tutor.id}`} // Adjust based on data structure
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                  
                  {tutor.role !== 'VERIFIED_TUTOR' ? (
                    <Button 
                      onClick={() => handleVerify(tutor.tutorProfileId)} // Use the actual profile ID
                      disabled={processingId === tutor.tutorProfileId}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-indigo-500/30 flex-1 lg:flex-none"
                    >
                      {processingId === tutor.tutorProfileId ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Approve Expert'}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-5 h-5" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
             <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">No pending requests</h3>
             <p className="text-gray-500">Tutors who meet the 10-session requirement will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerificationsPage;
