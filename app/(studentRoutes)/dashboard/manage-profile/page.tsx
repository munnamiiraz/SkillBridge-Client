"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { StudentProfileService, StudentProfile } from '@/app/services/student-profile.service';

import { Sidebar } from './components/Sidebar';
import { AvatarUpload } from './components/AvatarUpload';
import { ProfileForm } from './components/ProfileForm';
import { DangerZone } from './components/DangerZone';

const StudentProfilePage: React.FC = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [profile, setProfile] = useState<StudentProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    image: '',
  });

  const [initialProfile, setInitialProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await StudentProfileService.getProfile();
        setProfile(userData);
        setInitialProfile(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    } else if (!sessionPending) {
      setIsLoading(false);
    }
  }, [session?.user?.id, sessionPending]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      await StudentProfileService.updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });
      
      toast.success('Profile updated successfully!');
      setInitialProfile(profile);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = initialProfile && (
    profile.name !== initialProfile.name ||
    profile.phone !== initialProfile.phone ||
    profile.address !== initialProfile.address ||
    profile.image !== initialProfile.image
  );

  if (isLoading || sessionPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Please log in to manage your profile settings.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            My Account Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Customize your learning profile and personal information.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {activeTab === 'profile' ? (
              <>
                <AvatarUpload 
                  currentImage={profile.image} 
                  onImageChange={(url) => setProfile(prev => ({...prev, image: url}))}
                  isUploading={isUploadingImage}
                  setIsUploading={setIsUploadingImage}
                />
                <ProfileForm 
                  profile={profile}
                  setProfile={setProfile}
                  handleSubmit={handleProfileUpdate}
                  isSaving={isSaving}
                  hasChanges={hasChanges}
                />
              </>
            ) : (
              <DangerZone 
                onDeleteAccount={StudentProfileService.deleteAccount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;