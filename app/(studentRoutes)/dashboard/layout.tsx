'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  UserCircle, 
  Star, 
  Settings, 
  Search, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const sidebarItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: 'My Bookings',
      href: '/dashboard/bookings',
      icon: <Calendar size={20} />,
    },
    {
      label: 'My Profile',
      href: '/dashboard/profile',
      icon: <UserCircle size={20} />,
    },
    {
      label: 'My Reviews',
      href: '/dashboard/reviews',
      icon: <Star size={20} />,
    },
    {
      label: 'Update Profile',
      href: '/dashboard/manage-profile',
      icon: <Settings size={20} />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-[80px] left-0 z-50 w-72 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-r border-gray-200/50 dark:border-gray-800/50 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl shadow-indigo-500/10' : '-translate-x-full'
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
          <div className="absolute top-1/4 -left-20 w-40 h-40 bg-indigo-600 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-purple-600 rounded-full blur-[80px]" />
        </div>

        <div className="relative flex flex-col h-full z-10">
          {/* User Info Header */}
          {session && (
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/10">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm" />
                  <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 overflow-hidden shrink-0">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{session.user.name?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-gray-900 dark:text-white truncate tracking-tight">
                    {session.user.name || 'Student User'}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Student
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-8">
            <p className="px-4 py-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-2">
              Menu Center
            </p>
            {sidebarItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative group flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 translate-x-1'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`transition-all duration-300 ${active ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:-rotate-3'}`}>
                    {item.icon}
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                  {active ? (
                    <ChevronRight className="absolute right-4 w-4 h-4 text-white/50" />
                  ) : (
                    <ChevronRight className="absolute right-4 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-800/50 space-y-3">
            <Link
              href="/tutors"
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-indigo-500/20"
              onClick={() => setSidebarOpen(false)}
            >
              <Search size={18} className="group-hover:scale-110 transition-transform" />
              <span>Explore Tutors</span>
            </Link>
            
            <button
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success('Signed out successfully');
                      router.push('/login');
                    }
                  }
                });
              }}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500/10 rounded-2xl transition-all duration-300 group"
            >
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72 transition-all duration-500">
        {/* Mobile Header Bar */}
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tighter bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SB</Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white transition-all active:scale-95 shadow-sm"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Dashboard Content Header - Desktop Only Info */}
        <div className="hidden lg:flex sticky top-0 z-20 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md px-10 py-6 border-b border-gray-200/30 dark:border-gray-800/30 items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {sidebarItems.find(item => item.href === pathname)?.label || 'Dashboard Overview'}
            </h1>
            <p className="text-xs font-bold text-gray-400 tracking-wide">Welcome back to your learning space</p>
          </div>
          <div className="flex items-center gap-4">
             {/* Dynamic slots if needed */}
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 md:p-10 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
