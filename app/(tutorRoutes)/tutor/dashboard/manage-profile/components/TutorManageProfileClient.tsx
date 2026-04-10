'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  updateTutorProfile, 
  createTutorProfile,
  TutorProfile 
} from '@/app/services/tutor-profile.service';
import { ImageUpload } from '@/components/common/ImageUpload';
import { authClient } from '@/lib/auth-client';

interface TutorManageProfileClientProps {
  initialProfile: TutorProfile | null;
  userRole: string;
}

export const TutorManageProfileClient: React.FC<TutorManageProfileClientProps> = ({ 
  initialProfile, 
  userRole 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'professional'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profile, setProfile] = useState<TutorProfile | null>(initialProfile);

  const handleProfileUpdate = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updateData: Record<string, any> = {};
      
      if (profile.bio && profile.bio.trim().length >= 10) {
        updateData.bio = profile.bio.trim();
      }
      if (profile.headline && profile.headline.trim().length >= 5) {
        updateData.headline = profile.headline.trim();
      }
      if (profile.hourlyRate && profile.hourlyRate >= 1) {
        updateData.hourlyRate = profile.hourlyRate;
      }
      if (profile.experience !== undefined && profile.experience >= 0) {
        updateData.experience = profile.experience;
      }
      if (profile.education && profile.education.trim().length >= 5) {
        updateData.education = profile.education.trim();
      }
      if (profile.user.image) {
        updateData.image = profile.user.image;
      }
      if (profile.banner) {
        updateData.banner = profile.banner;
      }
      if (profile.user.name) {
        updateData.name = profile.user.name;
      }
      updateData.isAvailable = profile.isAvailable;

      const result = await updateTutorProfile(updateData);

      if (result.data) {
        setSaveSuccess(true);
        toast.success('Profile updated successfully!');
        // Refresh session to update UI/Navbar immediately
        await authClient.getSession({ force: true });
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        toast.error(result.error?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const result = await createTutorProfile({
        hourlyRate: 25,
        bio: "Welcome to my profile! I am a passionate tutor ready to help you learn.",
        headline: "SkillBridge Tutor",
        experience: 0,
        education: ""
      });

      if (result.data) {
        toast.success('Profile initialized successfully!');
        setProfile(result.data);
      } else {
        toast.error(result.error?.message || 'Failed to create profile');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-6">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Tutor Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have a tutor profile yet. Create one to start teaching and managing your sessions.
          </p>
        </div>
        <button
          onClick={handleCreateProfile}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <nav className="p-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Basic Info</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('professional')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 mt-2 ${
                activeTab === 'professional'
                  ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Professional</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Performance
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Sessions</span>
                <span className="font-bold text-gray-900 dark:text-white">{profile.totalSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Rating</span>
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  {profile.averageRating}
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Available for Booking
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Students can book sessions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProfile(prev => prev ? { ...prev, isAvailable: !prev.isAvailable } : null)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                  profile.isAvailable ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${profile.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Basic Info etc. Same as original but interactive */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Info</h2>
              <div className="space-y-6">
                <ImageUpload 
                  defaultValue={profile.user.image || ''}
                  onUploadSuccess={(url) => setProfile(prev => prev ? { ...prev, user: { ...prev.user, image: url } } : null)}
                  label="Profile Picture"
                  className="mb-8"
                />

                <ImageUpload 
                  defaultValue={profile.banner || ''}
                  onUploadSuccess={(url) => setProfile(prev => prev ? { ...prev, banner: url } : null)}
                  label="Profile Banner (Shows on Find Teacher page)"
                  className="mb-8 aspect-video"
                />
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profile.user.name || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, user: { ...prev.user, name: e.target.value } } : null)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                    placeholder="Your public name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Headline</label>
                  <input
                    type="text"
                    value={profile.headline || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, headline: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  <textarea
                    rows={5}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            {/* Same toggle buttons as professional etc. */}
            <div className="flex justify-end">
              <button
                onClick={handleProfileUpdate}
                disabled={isSaving}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Basic Info'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="space-y-8">
             <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, hourlyRate: parseFloat(e.target.value) || 0 } : null)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    value={profile.experience}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, experience: parseInt(e.target.value) || 0 } : null)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Education</label>
                  <textarea
                    rows={3}
                    value={profile.education || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, education: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleProfileUpdate}
                disabled={isSaving}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Professional Info'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
