"use client"
import React from 'react';
import { User, ShieldCheck, CheckCircle2, BadgeCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: 'profile' | 'security';
  setActiveTab: (tab: 'profile' | 'security') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="lg:col-span-1 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="space-y-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group ${
            activeTab === 'profile'
              ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
          }`}
        >
          <User size={20} className={`${activeTab === 'profile' ? 'text-white' : 'text-indigo-500 group-hover:scale-110 transition-transform'}`} />
          Profile Settings
        </button>
      </div>

      {/* Account Status Card */}
      <div className="relative overflow-hidden p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-4 group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-colors" />
        
        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Profile Status</h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
              <BadgeCheck size={20} />
            </div>
            <div>
              <div className="text-sm font-black text-gray-900 dark:text-white">Active Learner</div>
              <p className="text-[10px] font-bold text-gray-400">verified status</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
              Your profile is <span className="text-green-600 dark:text-green-400 font-bold">100% complete</span>. You can now book sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
