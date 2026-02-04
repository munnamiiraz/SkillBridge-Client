"use client"
import React from 'react';
import { User, Trash2, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
  activeTab: 'profile' | 'security';
  setActiveTab: (tab: 'profile' | 'security') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};
