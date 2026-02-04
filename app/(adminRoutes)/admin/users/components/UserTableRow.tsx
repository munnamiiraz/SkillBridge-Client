"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { User, UserService } from '@/app/admin/users.service';
import { useRouter } from 'next/navigation';
import BanModal from './BanModal';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user, isSelected, onSelect }) => {
  const router = useRouter();
  const [showBanModal, setShowBanModal] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);

  const handleUnban = async () => {
    if (!confirm('Are you sure you want to unban this user?')) return;
    setIsUnbanning(true);
    try {
      const result = await UserService.unban(user.id);
      if (result.success) {
        toast.success('User unbanned successfully');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to unban');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error');
    } finally {
      setIsUnbanning(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: User['status']) => {
    const badges = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      banned: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(user.id)}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3 min-w-[200px] max-w-[300px]">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 dark:text-white truncate" title={user.name}>
                {user.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              user.role === 'tutor'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
            }`}
          >
            {user.role === 'tutor' ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm">
            {user.role === 'tutor' ? (
              <>
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{user.stats.students}</span>
                  <span className="text-gray-500 dark:text-gray-400">students</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{user.stats.rating?.toFixed(1)}</span>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{user.stats.completedCourses}</span>
                  <span className="text-gray-500 dark:text-gray-400">courses</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{user.stats.hoursLearned}</span>
                  <span className="text-gray-500 dark:text-gray-400">hours</span>
                </div>
              </>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                user.verification?.email ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={user.verification?.email ? 'Email verified' : 'Email not verified'}
            ></div>
            <div
              className={`w-2 h-2 rounded-full ${
                user.verification?.phone ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={user.verification?.phone ? 'Phone verified' : 'Phone not verified'}
            ></div>
            <div
              className={`w-2 h-2 rounded-full ${
                user.verification?.identity ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={user.verification?.identity ? 'Identity verified' : 'Identity not verified'}
            ></div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
          {formatDate(user.joinDate)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="View Details"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {user.status === 'banned' ? (
              <button
                type="button"
                onClick={handleUnban}
                disabled={isUnbanning}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isUnbanning ? '...' : 'Unban'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowBanModal(true)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Ban
              </button>
            )}
          </div>
        </td>
      </tr>
      {showBanModal && (
        <BanModal user={user} onClose={() => setShowBanModal(false)} />
      )}
    </>
  );
};

export default UserTableRow;
