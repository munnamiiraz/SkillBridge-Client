'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Bell, Search, LogOut, ChevronRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN'))) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-8 w-8 animate-pulse rounded-full bg-indigo-500/20"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out successfully');
          router.push('/login');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 font-inter selection:bg-indigo-500/30" style={{ zoom: 0.8 }}>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border-r border-gray-200/50 dark:border-gray-800/50 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl shadow-indigo-500/10' : '-translate-x-full'
        }`}
      >
        <AdminSidebar userRole={session.user.role} />
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72 min-h-screen transition-all duration-500">
        {/* Premium System Header */}
        <header className="sticky top-0 z-30 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="h-20 px-6 md:px-10 flex items-center justify-between">
            {/* Context Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white transition-all active:scale-95 shadow-sm"
              >
                <Menu size={20} />
              </button>
              
              <div className="hidden sm:block">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  <span>System Root</span>
                  <ChevronRight size={10} className="text-gray-300" />
                  <span className="text-indigo-500">Command Center</span>
                </nav>
                <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  {pathname.split('/').pop()?.replace('-', ' ') || 'Overview'}
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </h1>
              </div>
            </div>

            {/* System Actions Right */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Universal Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all w-72 group">
                <Search size={16} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Universal search..." 
                  className="bg-transparent border-none outline-none text-xs font-bold text-gray-600 dark:text-gray-300 w-full placeholder:text-gray-400"
                />
              </div>

              {/* Status Indicators */}
              <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-gray-200/50 dark:border-gray-800/50">
                <button className="relative p-2.5 rounded-xl bg-gray-100/50 dark:bg-gray-900/50 text-gray-500 hover:text-indigo-500 transition-all group">
                  <Bell size={18} className="group-hover:rotate-12 transition-transform" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-950"></span>
                </button>
              </div>

              {/* Identity & Session */}
              {session && (
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{session.user.name}</p>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Verified {session.user.role.replace('_', ' ')}</p>
                  </div>
                  
                  <button 
                    onClick={handleSignOut}
                    className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 group"
                    title="Sign Out"
                  >
                    <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="px-6 py-12 lg:px-10 lg:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-8xl mx-auto">
           {children}
        </main>
      </div>
    </div>
  );
}
