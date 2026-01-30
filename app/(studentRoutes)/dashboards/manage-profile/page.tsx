"use client"
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Camera, User, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}

const StudentProfilePage: React.FC = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/student/profile`, {
          withCredentials: true
        });

        if (response.data.success) {
          const userData = response.data.data;
          const mappedProfile = {
            id: userData.id,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            image: userData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'User'}`,
          };
          setProfile(mappedProfile);
          setInitialProfile(mappedProfile);
        }
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
  }, [session, sessionPending]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        image: profile.image
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/student/profile`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setInitialProfile(profile);
      } else {
        toast.error(response.data.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll use a local preview. In a real app, you'd upload this to 
    // Cloudinary/S3 and save the URL.
    setIsUploadingImage(true);
    try {
      // Simulating upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, image: imageUrl }));
      toast.success('Image selected! Don\'t forget to save changes.');
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setIsUploadingImage(false);
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
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2 animate-in fade-in slide-in-from-left-4 duration-500">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
              }`}
            >
              <User size={20} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                activeTab === 'security'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
              }`}
            >
              <Trash2 size={20} />
              Danger Zone
            </button>

            {/* Account Status Card */}
            <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Account Status</h4>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold mb-1">
                <CheckCircle2 size={18} />
                <span>Active Learner</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Verified student since 2024</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                {/* Avatar Card */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-indigo-50 dark:ring-indigo-900/30 group-hover:ring-indigo-500 transition-all duration-300">
                        <img 
                          src={profile.image} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
                      >
                        <Camera size={18} />
                      </button>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Change Avatar</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-xs mx-auto sm:mx-0">
                        Upload a profile picture to help teachers and peers identify you in sessions.
                      </p>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-colors text-sm"
                      >
                        Select Image
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Info Grid */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User size={16} className="text-indigo-500" />
                        Full Name
                      </label>
                      <input 
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        placeholder="Your full name"
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                      />
                    </div>

                    {/* Email (Disabled) */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail size={16} className="text-indigo-500" />
                        Email Address
                      </label>
                      <input 
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-5 py-3.5 bg-gray-200 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 cursor-not-allowed outline-none transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Phone size={16} className="text-indigo-500" />
                        Phone Number
                      </label>
                      <input 
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-500" />
                        Location / Address
                      </label>
                      <input 
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                        placeholder="City, Country"
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving || !hasChanges}
                    className={`px-10 py-4 rounded-2xl font-bold text-white transition-all shadow-xl flex items-center gap-3 ${
                      isSaving || !hasChanges
                        ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed text-gray-500'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30 hover:-translate-y-1'
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={20} />
                    )}
                    {isSaving ? 'Saving Changes...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Danger Zone Content */}
                <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-3xl border border-red-100 dark:border-red-900/30">
                  <h3 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-2">Delete Account</h3>
                  <p className="text-red-700 dark:text-red-300/80 mb-6">
                    Deleting your account will permanently remove all your session history, bookings, and credits. This action cannot be undone.
                  </p>
                  <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20">
                    Purge My Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;