'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { updateStudentProfile, StudentProfile } from '@/app/services/student-profile.service';
import { authClient } from '@/lib/auth-client';
import { Sidebar } from './Sidebar';
import { AvatarUpload } from './AvatarUpload';
import { ProfileForm } from './ProfileForm';

interface ManageProfileClientProps {
  initialProfile: StudentProfile;
}

export const ManageProfileClient: React.FC<ManageProfileClientProps> = ({ initialProfile }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [savedProfile, setSavedProfile] = useState<StudentProfile>(initialProfile);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateStudentProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        image: profile.image
      });
      
      if (result.data?.success) {
        toast.success('Profile updated successfully!');
        setSavedProfile(profile);
        // Sync Navbar session
        await authClient.getSession({ force: true });
      } else {
        toast.error(result.error?.message || result.data?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = (
    profile.name !== savedProfile.name ||
    profile.phone !== savedProfile.phone ||
    profile.address !== savedProfile.address ||
    profile.image !== savedProfile.image
  );

  return (
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
          <></>
        )}
      </div>
    </div>
  );
};
