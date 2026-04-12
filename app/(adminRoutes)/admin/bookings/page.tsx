'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  XCircle, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Filter,
  ArrowRight
} from 'lucide-react';
import { adminService } from '@/app/services/admin.service';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import Skeleton from '@/components/ui/Skeleton';
import { authClient } from '@/lib/auth-client';

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data: session } = authClient.useSession();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const result = await adminService.getBookings(page, 10, search, statusFilter);
    if (result) {
      setBookings(result.data);
      setMeta(result.meta);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId: string, subject: string) => {
    const reason = prompt(`Reason for cancelling session "${subject}":`);
    if (reason === null) return;
    if (!reason) {
        toast.error('Cancellation reason is required');
        return;
    }
    
    const res = await adminService.cancelBooking(bookingId, reason);
    if (res) {
      toast.success('Session has been cancelled and student notified');
      fetchBookings();
    }
  };

  const isSuper = (session?.user as any).role === 'SUPER_ADMIN';

  const getStatusBadge = (status: string) => {
    const styles: any = {
      COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      CANCELLED: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
      PENDING: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      CONFIRMED: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
      ONGOING: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
    };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${styles[status] || styles.PENDING}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Pedagogical Logistics</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Global oversight of educational sessions and fulfillment cycles</p>
        </div>
        <div className="flex bg-white dark:bg-gray-900 rounded-3xl p-1.5 border border-gray-100 dark:border-gray-800 shadow-sm">
           {['', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
              <button 
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {s || 'All Sessions'}
              </button>
           ))}
        </div>
      </div>

      {/* Control Area */}
      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
        <CardContent className="p-6">
           <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-all" size={20} />
              <Input 
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by subject, student, or session ID..."
                className="pl-14 h-16 rounded-3xl bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-lg shadow-inner"
              />
           </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
         {loading ? (
            [1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-4xl" />)
         ) : bookings.length === 0 ? (
            <div className="p-20 text-center font-bold uppercase text-gray-400 tracking-widest bg-white dark:bg-gray-900 rounded-[3rem]">No sessions match your search criteria</div>
         ) : (
            bookings.map((booking) => (
               <div key={booking.id} className="group relative bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                     {/* Status & ID */}
                     <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:w-32 shrink-0">
                        {getStatusBadge(booking.status)}
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                           <Hash size={10} /> {booking.id.slice(0, 8)}
                        </p>
                     </div>

                     {/* Participants Info */}
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                        <div>
                           <h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-2 truncate">{booking.subject}</h4>
                           <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-xs font-bold text-gray-500">{new Date(booking.scheduledAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                              <Clock size={14} className="text-gray-400 ml-2" />
                              <span className="text-xs font-bold text-gray-500">{booking.duration} Min</span>
                           </div>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-white dark:border-gray-900 shadow-sm flex items-center justify-center font-bold text-xs text-indigo-600">
                                 {booking.user.name[0]}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Student</p>
                                 <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{booking.user.name}</p>
                              </div>
                           </div>
                           <ArrowRight className="text-gray-300 hidden md:block" size={16} />
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 border-2 border-white dark:border-gray-900 shadow-sm flex items-center justify-center font-bold text-xs text-white">
                                 {booking.tutor_profile.user.name[0]}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Expert</p>
                                 <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{booking.tutor_profile.user.name}</p>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-8">
                           <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Investment</p>
                              <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tighter">${booking.price.toFixed(2)}</p>
                           </div>
                           
                           {isSuper && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                              <button 
                                onClick={() => handleCancel(booking.id, booking.subject)}
                                className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 group/btn"
                                title="Force Cancel Session"
                              >
                                 <XCircle size={18} className="group-hover/btn:rotate-90 transition-transform" />
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            ))
         )}
      </div>

      {/* Pagination Footer */}
      {meta && meta.totalPages > 1 && (
         <div className="flex items-center justify-center gap-3 pt-6">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-5 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs font-bold uppercase text-gray-500 hover:text-indigo-600 disabled:opacity-50 transition-all shadow-sm active:scale-95"
            >Previous Page</button>
            <div className="flex items-center gap-1.5">
               {[...Array(meta.totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${page === i + 1 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                     {i + 1}
                  </button>
               ))}
            </div>
            <button 
              disabled={page === meta.totalPages}
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              className="px-5 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs font-bold uppercase text-gray-500 hover:text-indigo-600 disabled:opacity-50 transition-all shadow-sm active:scale-95"
            >Next Page</button>
         </div>
      )}

      {!isSuper && (
         <div className="p-10 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
               <AlertCircle size={32} />
            </div>
            <h4 className="text-xl font-bold text-indigo-600 uppercase tracking-tighter">Limited Logistical Control</h4>
            <p className="text-sm text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">Standard Administrative users can monitor global session flows but are restricted from forceful logistical cancellations. This safeguard prevents accidental disruption of established learning paths. Direct session overrides are exclusive to the <span className="font-bold text-indigo-700">Super Admin</span> portal.</p>
         </div>
      )}
    </div>
  );
}
