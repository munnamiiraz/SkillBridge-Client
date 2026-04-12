'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  ShieldAlert,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Mail,
  MoreHorizontal,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { adminService } from '@/app/services/admin.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import Skeleton from '@/components/ui/Skeleton';
import { authClient } from '@/lib/auth-client';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data: session } = authClient.useSession();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await adminService.getUsers(page, 10, search, roleFilter);
    if (result) {
      setUsers(result.data);
      setMeta(result.meta);
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
       fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleStatusUpdate = async (userId: string, status: string, name: string) => {
    if (status === 'BANNED' && !confirm(`Are you sure you want to ban ${name}?`)) return;
    
    const res = await adminService.updateUserStatus(userId, { 
      status, 
      banReason: status === 'BANNED' ? 'Violated platform terms' : undefined 
    });

    if (res) {
      toast.success(`User ${name} status updated to ${status}`);
      fetchUsers();
    }
  };

  const isSuper = (session?.user as any).role === 'SUPER_ADMIN';

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Identity Governance</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium">Manage and monitor all platform stakeholders</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-white dark:bg-gray-900 rounded-2xl p-1 border border-gray-100 dark:border-gray-800 shadow-sm">
              <button 
                onClick={() => setRoleFilter('')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === '' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
              >All</button>
              <button 
                onClick={() => setRoleFilter('STUDENT')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === 'STUDENT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
              >Students</button>
              <button 
                onClick={() => setRoleFilter('TUTOR')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === 'TUTOR' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
              >Tutors</button>
              <button 
                onClick={() => setRoleFilter('ADMIN')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === 'ADMIN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
              >Admins</button>
           </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
        <CardContent className="p-6">
           <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, email, or identifier..."
                className="pl-14 h-16 rounded-3xl bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-lg"
              />
           </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Full Identity</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Authority Role</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Account Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Analytics</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                     {loading ? (
                        [1,2,3,4,5].map(i => (
                           <tr key={i}><td colSpan={5} className="p-8"><Skeleton className="h-10 w-full rounded-2xl" /></td></tr>
                        ))
                     ) : users.length === 0 ? (
                        <tr><td colSpan={5} className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest">No matching identities found</td></tr>
                     ) : (
                        users.map((user) => (
                           <tr key={user.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-300">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="relative">
                                       <div className="absolute -inset-1 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-sm" />
                                       <div className="relative w-11 h-11 rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shadow-sm overflow-hidden">
                                          {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : user.name[0]}
                                       </div>
                                    </div>
                                    <div>
                                       <p className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{user.name}</p>
                                       <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                                          <Mail size={10} /> {user.email}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6 align-middle">
                                 <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter border ${
                                    user.role === 'SUPER_ADMIN' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                    user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                    user.role === 'TUTOR' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                    user.role === 'VERIFIED_TUTOR' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                    'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                 }`}>
                                    {user.role}
                                 </span>
                              </td>
                              <td className="px-8 py-6 align-middle">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : user.status === 'BANNED' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                    <span className="text-xs font-black text-gray-700 dark:text-gray-300 trekking-tight uppercase">{user.status}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 align-middle">
                                 {user.tutor_profile ? (
                                    <div className="flex items-center gap-6">
                                       <div>
                                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Rating</p>
                                          <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                            <span className="text-[10px]">★</span>
                                            {Number(user.tutor_profile.averageRating || 0).toFixed(1)}
                                          </p>
                                       </div>
                                       <div>
                                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Reviews</p>
                                          <p className="text-xs font-black text-gray-900 dark:text-white">{user.tutor_profile.totalReviews}</p>
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="flex items-center h-full">
                                       <span className="text-[10px] text-gray-400 font-bold italic opacity-60">N/A</span>
                                    </div>
                                 )}
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    {isSuper && user.role !== 'SUPER_ADMIN' && (
                                       <>
                                          {user.status === 'BANNED' ? (
                                             <button 
                                               onClick={() => handleStatusUpdate(user.id, 'ACTIVE', user.name)}
                                               className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                                               title="Unban Identity"
                                             >
                                                <UserCheck size={16} />
                                             </button>
                                          ) : (
                                             <button 
                                                onClick={() => handleStatusUpdate(user.id, 'BANNED', user.name)}
                                                className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                title="Revoke Access (Ban)"
                                             >
                                                <Ban size={16} />
                                             </button>
                                          )}
                                       </>
                                    )}
                                    <button className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95">
                                       <MoreHorizontal size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
               <div className="px-8 py-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-400">Showing <span className="text-gray-900 dark:text-white">{users.length}</span> of <span className="text-gray-900 dark:text-white">{meta.total}</span> identifies</p>
                  <div className="flex items-center gap-2">
                     <button 
                       disabled={page === 1}
                       onClick={() => setPage(p => Math.max(1, p - 1))}
                       className="p-2 rounded-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 disabled:opacity-50 transition-all"
                     >
                        <ChevronLeft size={16} />
                     </button>
                     <div className="flex items-center gap-1 mx-2">
                        {[...Array(meta.totalPages)].map((_, i) => (
                           <button 
                             key={i} 
                             onClick={() => setPage(i + 1)}
                             className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${page === i + 1 ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                           >
                              {i + 1}
                           </button>
                        ))}
                     </div>
                     <button 
                       disabled={page === meta.totalPages}
                       onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                       className="p-2 rounded-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 disabled:opacity-50 transition-all"
                     >
                        <ChevronRight size={16} />
                     </button>
                  </div>
               </div>
            )}
         </CardContent>
      </Card>

      {/* Warning Area for Admins */}
      {!isSuper && (
         <div className="bg-amber-500/5 border border-amber-500/20 rounded-4xl p-8 flex gap-6 items-start">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
               <AlertCircle size={24} />
            </div>
            <div>
               <h4 className="text-lg font-black text-amber-500 uppercase tracking-tight mb-2">Restricted Operational Authority</h4>
               <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">As a standard Administrator, you have read-access to the user database but lack the structural authority to ban or unban accounts. Access revocation is strictly reserved for the <span className="font-black text-amber-600">Super Admin</span> role. Contact site leadership for account-level overrides.</p>
            </div>
         </div>
      )}
    </div>
  );
}