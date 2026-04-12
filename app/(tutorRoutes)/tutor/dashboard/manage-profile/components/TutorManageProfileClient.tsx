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
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
      {/* Sidebar Navigation - Futuristic Control Panel */}
      <aside className="lg:w-80 shrink-0 space-y-8">
        <div className="relative overflow-hidden bg-white/50 dark:bg-gray-950/70 backdrop-blur-3xl rounded-[3rem] border border-gray-200/50 dark:border-gray-800/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-indigo-500/10">
          {/* Internal Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
          
          <div className="relative p-6 space-y-4">
             <div className="px-4 py-2 mb-2">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Workspace identity</p>
             </div>
             
             <nav className="space-y-2">
               <button
                 type="button"
                 onClick={() => setActiveTab('profile')}
                 className={`w-full flex items-center justify-between px-6 py-5 rounded-[2rem] font-black text-sm transition-all duration-500 group ${
                   activeTab === 'profile'
                     ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 scale-[1.02] translate-x-1'
                     : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                 }`}
               >
                 <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-all duration-500 ${activeTab === 'profile' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-500/20'}`}>
                       <svg className={`w-5 h-5 ${activeTab === 'profile' ? 'text-white' : 'text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                       </svg>
                    </div>
                    <span className="tracking-tight uppercase text-xs">Identity</span>
                 </div>
                 {activeTab === 'profile' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
               </button>
   
               <button
                 type="button"
                 onClick={() => setActiveTab('professional')}
                 className={`w-full flex items-center justify-between px-6 py-5 rounded-[2rem] font-black text-sm transition-all duration-500 group ${
                   activeTab === 'professional'
                     ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 scale-[1.02] translate-x-1'
                     : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                 }`}
               >
                 <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-all duration-500 ${activeTab === 'professional' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-500/20'}`}>
                       <svg className={`w-5 h-5 ${activeTab === 'professional' ? 'text-white' : 'text-purple-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                       </svg>
                    </div>
                    <span className="tracking-tight uppercase text-xs">Expertise</span>
                 </div>
                 {activeTab === 'professional' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
               </button>
             </nav>
   
             <div className="pt-6 border-t border-gray-200/50 dark:border-gray-800/80 mt-4 space-y-6">
               <div className="px-4">
                 <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-4">Authority metrics</p>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between group p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-transparent hover:border-indigo-500/20 transition-all">
                     <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">Success Rate</span>
                     <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black tracking-tighter shadow-sm">98% OPTIMAL</span>
                   </div>
                   <div className="flex items-center justify-between group p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-transparent hover:border-indigo-500/20 transition-all">
                     <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">Authority Score</span>
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-black tracking-tighter">
                       {profile.averageRating.toFixed(1)} / 5
                     </div>
                   </div>
                 </div>
               </div>
   
               <div className="pt-2 px-2">
                 <div className="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-indigo-600/5 dark:bg-indigo-600/10 border border-indigo-200/50 dark:border-indigo-500/20 group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                   <div className="min-w-0">
                     <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">Availability</p>
                     <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">{profile.isAvailable ? 'Public Routing' : 'Offline Mode'}</p>
                   </div>
                   <button
                     type="button"
                     onClick={() => setProfile(prev => prev ? { ...prev, isAvailable: !prev.isAvailable } : null)}
                     className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 focus:outline-none ${
                       profile.isAvailable ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)] scale-110' : 'bg-gray-300 dark:bg-gray-800'
                     }`}
                   >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-500 shadow-md ${profile.isAvailable ? 'translate-x-[1.4rem]' : 'translate-x-1.5'}`} />
                   </button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 animate-in fade-in slide-in-from-right-8 duration-700">
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="relative overflow-hidden bg-white/60 dark:bg-gray-950/60 backdrop-blur-3xl rounded-[3.5rem] border border-gray-200/50 dark:border-gray-800/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 lg:p-14 group">
               {/* Decorative background glow */}
               <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-600/10 transition-colors duration-1000" />
               
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="p-5 rounded-3xl bg-indigo-500/10 text-indigo-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0a1 1 0 011-1h2a1 1 0 011 1m-4 0h4m-4 0v1m4 0v1m-4-1h4" />
                        </svg>
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Identity Profiling</h2>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-tight">Configure your visual presence and platform narrative</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">Tutor Avatar</label>
                        <div className="p-6 rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 transition-all duration-500 bg-white dark:bg-black/20">
                           <ImageUpload 
                              defaultValue={profile.user.image || ''}
                              onUploadSuccess={(url) => setProfile(prev => prev ? { ...prev, user: { ...prev.user, image: url } } : null)}
                              label=""
                              className="scale-105"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest px-1">Brand Banner</label>
                        <div className="p-6 rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-purple-500/50 transition-all duration-500 bg-white dark:bg-black/20">
                           <ImageUpload 
                              defaultValue={profile.banner || ''}
                              onUploadSuccess={(url) => setProfile(prev => prev ? { ...prev, banner: url } : null)}
                              label=""
                              className="aspect-video rounded-3xl overflow-hidden scale-105"
                           />
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-14 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group space-y-3">
                           <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">Diplomatic Name</label>
                           <input
                              type="text"
                              value={profile.user.name || ''}
                              onChange={(e) => setProfile(prev => prev ? { ...prev, user: { ...prev.user, name: e.target.value } } : null)}
                              className="w-full px-8 py-5 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                              placeholder="Public alias..."
                           />
                        </div>

                        <div className="group space-y-3">
                           <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">Strategic Headline</label>
                           <input
                              type="text"
                              value={profile.headline || ''}
                              onChange={(e) => setProfile(prev => prev ? { ...prev, headline: e.target.value } : null)}
                              className="w-full px-8 py-5 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                              placeholder="Expert in Cloud Architecture..."
                           />
                        </div>
                     </div>

                     <div className="group space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">Platform Narrative (Bio)</label>
                        <textarea
                           rows={6}
                           value={profile.bio || ''}
                           onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                           className="w-full px-8 py-6 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all leading-relaxed"
                           placeholder="Describe your expertise..."
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-end pr-4">
              <button
                onClick={handleProfileUpdate}
                disabled={isSaving}
                className="group relative px-12 py-5 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-500 overflow-hidden disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center gap-3">
                   {isSaving ? (
                      <>
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         <span>Processing</span>
                      </>
                   ) : (
                      <>
                         <span>Synchronize Profile</span>
                         <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                         </svg>
                      </>
                   )}
                </div>
                {/* Button Shine Effect */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
             <div className="relative overflow-hidden bg-white/60 dark:bg-gray-950/60 backdrop-blur-3xl rounded-[3.5rem] border border-gray-200/50 dark:border-gray-800/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 lg:p-14 group">
               {/* Decorative background glow */}
               <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-purple-600/10 transition-colors duration-1000" />
               
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="p-5 rounded-3xl bg-purple-500/10 text-purple-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Professional Matrix</h2>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-tight">Financial targeting and educational authority configuration</p>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="group space-y-3">
                      <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] px-4">Hourly Fee (USD)</label>
                      <div className="relative">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</div>
                         <input
                           type="number"
                           value={profile.hourlyRate}
                           onChange={(e) => setProfile(prev => prev ? { ...prev, hourlyRate: parseFloat(e.target.value) || 0 } : null)}
                           className="w-full pl-12 pr-8 py-5 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                         />
                      </div>
                    </div>
                    <div className="group space-y-3">
                      <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] px-4">Years in Field</label>
                      <input
                        type="number"
                        value={profile.experience}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, experience: parseInt(e.target.value) || 0 } : null)}
                        className="w-full px-8 py-5 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 group space-y-3">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">Academic Credentials</label>
                      <textarea
                        rows={4}
                        value={profile.education || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, education: e.target.value } : null)}
                        className="w-full px-8 py-6 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all leading-relaxed"
                        placeholder="Universities, certifications..."
                      />
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="flex justify-end pr-4">
              <button
                onClick={handleProfileUpdate}
                disabled={isSaving}
                className="group relative px-12 py-5 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-500 overflow-hidden disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center gap-3">
                   {isSaving ? (
                      <>
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         <span>Deploying Details</span>
                      </>
                   ) : (
                      <>
                         <span>Finalize Professional Matrix</span>
                         <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                         </svg>
                      </>
                   )}
                </div>
                {/* Button Shine Effect */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
