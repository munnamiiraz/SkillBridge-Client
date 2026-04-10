'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Bell, Search, LogOut } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 font-sans selection:bg-indigo-500/30">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border-r border-gray-200/50 dark:border-gray-800/50 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl shadow-indigo-500/10' : '-translate-x-full'
        }`}
      >
        <AdminSidebar userRole={session.user.role} />
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-80 min-h-screen transition-all duration-500">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="h-20 px-8 flex items-center justify-between">
            {/* Mobile Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 text-gray-700 dark:text-gray-300 shadow-sm transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Center/Left info */}
            <div className="hidden lg:flex items-center gap-2">
               <h1 className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase">
                 {pathname.split('/').pop()?.replace('-', ' ')}
               </h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center relative group">
                <Search className="absolute left-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Universal Search..." 
                  className="pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
                />
              </div>

              <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 mx-2 hidden sm:block"></div>

              <button className="relative p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-all group">
                <Bell size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>

              <button 
                onClick={handleSignOut}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 group"
                title="Sign Out"
              >
                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {children}
        </main>
      </div>
    </div>
  );
}
