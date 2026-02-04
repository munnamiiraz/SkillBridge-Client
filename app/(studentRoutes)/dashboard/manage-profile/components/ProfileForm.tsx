"use client"
import React from 'react';
import { User, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '@/app/services/student-profile.service';

interface ProfileFormProps {
  profile: StudentProfile;
  setProfile: (profile: StudentProfile) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  hasChanges: boolean | null;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  profile, 
  setProfile, 
  handleSubmit, 
  isSaving, 
  hasChanges 
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
  );
};
