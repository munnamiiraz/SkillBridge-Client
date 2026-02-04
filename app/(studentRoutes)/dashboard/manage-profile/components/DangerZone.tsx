"use client"
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DangerZoneProps {
  onDeleteAccount: () => Promise<void>;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onDeleteAccount }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDeleteAccount();
      toast.success('Account deletion scheduled.'); // Placeholder
    } catch (error) {
      toast.error('Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Danger Zone Content */}
      <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-3xl border border-red-100 dark:border-red-900/30">
        <h3 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-2">Delete Account</h3>
        <p className="text-red-700 dark:text-red-300/80 mb-6">
          Deleting your account will permanently remove all your session history, bookings, and credits. This action cannot be undone.
        </p>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
          Purge My Data
        </button>
      </div>
    </div>
  );
};
