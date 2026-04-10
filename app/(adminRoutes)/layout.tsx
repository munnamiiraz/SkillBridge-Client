"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Calendar, 
  Layers, 
  Menu, 
  X, 
  LogOut, 
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  const menuItems = [
    {
      name: 'Stats',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <UsersIcon className="w-5 h-5" />,
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: 'Categories',
      href: '/admin/make-category',
      icon: <Layers className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } relative h-screen transition-all duration-500 ease-in-out bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col z-30 overflow-hidden`}
      >
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
          <div className="absolute top-1/2 left-0 w-40 h-40 bg-indigo-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 h-20 shrink-0 border-b border-gray-200/30 dark:border-gray-800/30">
          {sidebarOpen && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter leading-none">Admin</span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase">Control</span>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="mx-auto">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-7 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all text-gray-500 dark:text-gray-400 hover:text-indigo-600 focus:outline-none"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {sidebarOpen && (
            <p className="px-4 py-3 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
              Management
            </p>
          )}
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 dark:shadow-indigo-500/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'} transition-all duration-300 transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                {sidebarOpen && <span className="font-bold text-sm tracking-tight">{item.name}</span>}
                {isActive && sidebarOpen && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="relative p-4 border-t border-gray-200/30 dark:border-gray-800/30 space-y-4">
          {/* User Profile */}
          {session?.user && sidebarOpen && (
            <div className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-md shrink-0">
                  {session.user.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                    {session.user.name}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                    {(session.user as any)?.role || 'ADMIN'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                Logout
              </button>
            </div>
          )}

          {!sidebarOpen && (
            <button 
              onClick={handleLogout}
              className="w-12 h-12 mx-auto flex items-center justify-center rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10 flex flex-col">
        {/* Top Header Placeholder if needed */}
        <div className="h-20 shrink-0 bg-white/30 dark:bg-gray-900/10 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 flex items-center px-8 lg:px-12">
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
              {pathname === '/admin' ? 'Platform Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>
          {/* Action slots here */}
        </div>
        <main className="p-8 lg:p-12 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;