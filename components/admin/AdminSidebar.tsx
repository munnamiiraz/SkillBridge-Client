'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  ClipboardList, 
  Settings, 
  UserCircle,
  ChevronRight,
  ShieldCheck,
  Zap,
  BarChart3,
  ShieldAlert,
  Brain
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface AdminSidebarProps {
  userRole: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ userRole }) => {
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: 'User Management',
      href: '/admin/users',
      icon: <Users size={20} />,
    },
    {
      label: 'Tutor Hub',
      href: '/admin/tutors',
      icon: <Award size={20} />,
    },
    {
      label: 'Bookings',
      href: '/admin/bookings',
      icon: <ClipboardList size={20} />,
    },
    {
      label: 'Operational Analytics',
      href: '/admin/analytics',
      icon: <BarChart3 size={20} />,
      roles: ['SUPER_ADMIN']
    },
    {
      label: 'AI Knowledge Base',
      href: '/admin/knowledge-base',
      icon: <Brain size={20} />,
      roles: ['SUPER_ADMIN']
    },
    {
      label: 'System Config',
      href: '/admin/settings',
      icon: <Settings size={20} />,
      roles: ['SUPER_ADMIN']
    },
    {
      label: 'My Profile',
      href: '/admin/profile',
      icon: <UserCircle size={20} />,
    },
  ];

  const visibleItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-gray-200/50 dark:border-gray-800/50">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <p className="px-4 py-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-1">
            Supervision 
          </p>
          {visibleItems.map((item) => {
            const active = isActive(item.href);
            const isSuperOnly = item.roles?.includes('SUPER_ADMIN');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                  active
                    ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 translate-x-1'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className={`transition-all duration-300 ${active ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:-rotate-3'}`}>
                  {item.icon}
                </div>
                <span className="tracking-tight flex items-center gap-2">
                  {item.label}
                </span>
                {active ? (
                  <ChevronRight className="absolute right-4 w-4 h-4 text-white/50" />
                ) : (
                  <ChevronRight className="absolute right-4 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto p-6">
        <div className={`p-5 rounded-3xl border ${
          userRole === 'SUPER_ADMIN' 
            ? 'bg-linear-to-br from-indigo-600 to-purple-600 border-transparent text-white shadow-xl' 
            : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white'
        }`}>
          <div className="flex items-center gap-4 mb-4">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
               userRole === 'SUPER_ADMIN' ? 'bg-white/20' : 'bg-indigo-500/10 text-indigo-600'
             }`}>
               {userRole === 'SUPER_ADMIN' ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
             </div>
             <div>
               <p className={`text-[10px] font-black uppercase tracking-widest ${
                 userRole === 'SUPER_ADMIN' ? 'text-white/60' : 'text-gray-400'
               }`}>Current Identity</p>
               <p className="text-xs font-black tracking-tight">{userRole.replace('_', ' ')}</p>
             </div>
          </div>
          <p className={`text-[9px] font-medium leading-relaxed ${
             userRole === 'SUPER_ADMIN' ? 'text-indigo-100' : 'text-gray-500'
          }`}>
            {userRole === 'SUPER_ADMIN' 
              ? 'Full structural authority granted. All platform variables accessible.' 
              : 'Standard operational access. Restricted from structural site changes.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
