"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { User, UserService } from '@/app/admin/users.service';
import { useRouter } from 'next/navigation';

interface BanModalProps {
  user: User;
  onClose: () => void;
}

const BanModal: React.FC<BanModalProps> = ({ user, onClose }) => {
  const [banReason, setBanReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirmBanUser = async () => {
    if (!banReason.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await UserService.ban(user.id, banReason);
      if (result.success) {
        toast.success('User banned successfully');
        onClose();
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to ban user');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Gradient Header */}
        <div className="relative p-6 bg-linear-to-br from-red-500 to-orange-500 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Ban User</h3>
              <p className="text-sm text-white/80">This action requires confirmation</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 ml-1">
              Reason for ban <span className="text-red-500">*</span>
            </label>
            <textarea
              autoFocus
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Please provide a clear reason for banning this user..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmBanUser}
              disabled={!banReason.trim() || isSubmitting}
              className="flex-1 px-6 py-3 bg-linear-to-br from-red-600 to-orange-600 text-white font-bold rounded-2xl hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/30 active:scale-95"
            >
              {isSubmitting ? 'Banning...' : 'Confirm Ban'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BanModal;
