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
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  ClipboardList,
  Clock,
  ShieldCheck,
  Search,
  BarChart3,
  Lock,
  TrendingUp
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Logo from '@/components/ui/Logo';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

export default function TutorDashboardLayout({
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
      href: '/tutor/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: 'Sessions',
      href: '/tutor/dashboard/sessions',
      icon: <ClipboardList size={20} />,
    },
    {
      label: 'Availability',
      href: '/tutor/dashboard/availability',
      icon: <Clock size={20} />,
    },
    {
      label: 'My Reviews',
      href: '/tutor/dashboard/reviews',
      icon: <Star size={20} />,
    },
    {
      label: 'Manage Profile',
      href: '/tutor/dashboard/manage-profile',
      icon: <Settings size={20} />,
    },
    {
      label: 'Verification',
      href: '/tutor/dashboard/verification',
      icon: <ShieldCheck size={20} />,
    },
    {
      label: 'Advanced Analytics',
      href: '/tutor/dashboard/analytics',
      icon: <BarChart3 size={20} />,
      roles: ['VERIFIED_TUTOR']
    },
    {
      label: 'Market Intel',
      href: '/tutor/dashboard/market-intelligence',
      icon: <TrendingUp size={20} />,
      roles: ['VERIFIED_TUTOR']
    },
  ];

  const visibleSidebarItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes((session?.user as any)?.role)
  );

  const isVerified = (session?.user as any)?.role === 'VERIFIED_TUTOR';

  const isActive = (href: string) => {
    if (href === '/tutor/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 font-outfit selection:bg-indigo-500/30" style={{ zoom: 0.75 }}>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-r border-gray-200/50 dark:border-gray-800/50 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl shadow-indigo-500/10' : '-translate-x-full'
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
          <div className="absolute top-1/4 -left-20 w-40 h-40 bg-indigo-600 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-purple-600 rounded-full blur-[80px]" />
        </div>

        <div className="relative flex flex-col h-full z-10">
          {/* Logo / Identity Section */}
          <div className="p-8 border-b border-gray-200/50 dark:border-gray-800/50">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-8">
            <p className="px-4 py-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-2">
              Teaching Hub
            </p>
            {sidebarItems.map((item) => {
              const active = isActive(item.href);
              const isLocked = item.roles && !item.roles.includes((session?.user as any)?.role);
              
              if (isLocked) {
                return (
                  <div
                    key={item.href}
                    className="relative flex items-center gap-3 px-4 py-4 rounded-3xl text-sm font-bold text-gray-300 dark:text-gray-600 cursor-not-allowed border border-dashed border-gray-200 dark:border-gray-800/50 opacity-60"
                  >
                    <div className="grayscale">
                      {item.icon}
                    </div>
                    <span className="tracking-tight">{item.label}</span>
                    <div className="absolute right-4 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-[8px] font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1 shadow-sm">
                      <Lock size={8} />
                      Verified
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative group flex items-center gap-3 px-4 py-4 rounded-3xl text-sm font-bold transition-all duration-300 ${
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

            {!isVerified && (
               <Link
                 href="/tutor/dashboard/verification"
                 className="relative group flex items-center justify-between gap-3 px-4 py-4 rounded-3xl text-sm font-bold text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/40 border border-dashed border-gray-200 dark:border-gray-800 transition-all"
               >
                 <div className="flex items-center gap-3">
                   <Lock size={20} className="text-gray-300" />
                   <span className="tracking-tight">Authority Analytics</span>
                 </div>
                 <Sparkles size={14} className="text-amber-500 animate-pulse" />
               </Link>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-800/50 space-y-3">
            <Link
              href="/tutors"
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white rounded-2xl transition-all duration-300 group shadow-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <Search size={18} className="group-hover:scale-110 transition-transform" />
              <span>Preview Profile</span>
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
        
        {/* Modern Application Header */}
        <header className="sticky top-0 z-30 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="px-6 md:px-10 h-20 flex items-center justify-between">
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
                  <span>Workspace</span>
                  <ChevronRight size={10} />
                  <span className="text-indigo-500">Tutor Management</span>
                </nav>
                <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  {sidebarItems.find(item => item.href === pathname)?.label || 'Console Overview'}
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </h1>
              </div>
            </div>

            {/* Actions Right */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* User Identity */}
              {session && (
                <div className="flex items-center gap-4 pl-4 md:pl-6 border-l border-gray-200/50 dark:border-gray-800/50">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{session.user.name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-tighter ${(session.user as any).role === 'VERIFIED_TUTOR' ? 'text-indigo-500' : 'text-gray-400'}`}>
                      {(session.user as any).role === 'VERIFIED_TUTOR' ? 'Elite Partner' : 'Rising Star'}
                    </p>
                  </div>
                  <div className={`relative group p-0.5 rounded-2xl ${(session.user as any).role === 'VERIFIED_TUTOR' ? 'bg-linear-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20' : 'bg-gray-200 dark:bg-gray-800'}`}>
                    <div className="w-10 h-10 rounded-[14px] overflow-hidden bg-white dark:bg-gray-900 p-0.5">
                      {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover rounded-[12px]" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">
                          {session.user.name?.[0]?.toUpperCase() || 'T'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 md:p-10 animate-fade-in min-h-[calc(100vh-180px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
