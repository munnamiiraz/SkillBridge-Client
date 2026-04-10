'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Award, 
  Search, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Clock,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { adminService } from '@/app/services/admin.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import Skeleton from '@/components/ui/Skeleton';
import { authClient } from '@/lib/auth-client';

export default function TutorHubPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { data: session } = authClient.useSession();

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    // Fetch only tutors
    const result = await adminService.getUsers(1, 20, search, 'TUTOR');
    if (result) {
      setTutors(result.data.filter((u: any) => u.tutor_profile));
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const handleVerify = async (tutorProfileId: string, name: string) => {
    if (!confirm(`Are you sure you want to verify ${name}? This will grant them the "Verified Expert" badge.`)) return;
    
    const res = await adminService.verifyTutor(tutorProfileId);
    if (res) {
      toast.success(`${name} has been verified successfully`);
      fetchTutors();
    }
  };

  const isSuper = session?.user.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Academic Authority Hub</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Vetting and promotion of the platform's professional coaching team</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2 shadow-sm">
              <Clock size={14} />
              Pending Review: {tutors.filter(t => !t.tutor_profile.isVerified).length}
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6">
         <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-all" size={20} />
            <Input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by subject expertise, education or name..."
              className="pl-14 h-16 rounded-[1.8rem] bg-white dark:bg-gray-900 border-none shadow-sm focus:ring-4 focus:ring-indigo-500/10 text-lg"
            />
         </div>
         <button className="px-8 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:border-indigo-500/30 transition-all shadow-sm active:scale-95 flex items-center gap-2">
            Advanced Filters
         </button>
      </div>

      {/* Tutor Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {loading ? (
            [1,2,3,4].map(i => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)
         ) : tutors.length === 0 ? (
            <div className="col-span-full p-20 text-center font-black uppercase text-gray-400 tracking-widest">No matching tutors found</div>
         ) : (
            tutors.map((tutor) => (
               <Card key={tutor.id} className="group relative rounded-[2.8rem] border-gray-100/50 dark:border-gray-800/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Backdrop Gradient for Verified */}
                  {tutor.tutor_profile.isVerified && (
                     <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
                  )}

                  <CardContent className="p-10">
                     <div className="flex flex-col sm:flex-row gap-8 items-start">
                        {/* Avatar Column */}
                        <div className="relative shrink-0">
                           <div className={`absolute -inset-2 bg-linear-to-tr ${tutor.tutor_profile.isVerified ? 'from-indigo-500 to-purple-500' : 'from-gray-200 to-gray-300'} rounded-[2.5rem] opacity-20 blur-lg`} />
                           <div className="relative w-28 h-28 rounded-[2.2rem] bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow-xl overflow-hidden">
                              {tutor.image ? <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-3xl font-black bg-gray-50">{tutor.name[0]}</span>}
                           </div>
                           {tutor.tutor_profile.isVerified && (
                              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                                 <ShieldCheck size={20} />
                              </div>
                           )}
                        </div>

                        {/* Info Column */}
                        <div className="flex-1 min-w-0">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate">{tutor.name}</h3>
                              <span className="shrink-0 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                                 ${tutor.tutor_profile.hourlyRate}/hr
                              </span>
                           </div>

                           <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                                 <Star className="text-amber-500 fill-current" size={14} />
                                 {tutor.tutor_profile.averageRating?.toFixed(1) || '0.0'} Rating
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                                 <Briefcase size={14} />
                                 {tutor.tutor_profile.experience}Yrs Experience
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-bold col-span-2">
                                 <GraduationCap size={14} />
                                 <span className="truncate">{tutor.tutor_profile.education || 'Self-taught Expert'}</span>
                              </div>
                           </div>

                           <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50 dark:border-gray-800">
                              {tutor.tutor_profile.isVerified ? (
                                 <div className="flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                                    <ShieldCheck size={16} /> Verified Authority
                                 </div>
                              ) : (
                                 <>
                                    {isSuper ? (
                                       <button 
                                         onClick={() => handleVerify(tutor.tutor_profile.id, tutor.name)}
                                         className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.05] transition-all active:scale-95 flex items-center gap-2"
                                       >
                                          <CheckCircle size={14} /> Approve Verification
                                       </button>
                                    ) : (
                                       <div className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-tighter">
                                          <ShieldAlert size={16} /> Awaiting Super Admin
                                       </div>
                                    )}
                                 </>
                              )}
                              <a 
                                href={`/tutors/${tutor.id}`} 
                                target="_blank"
                                className="ml-auto p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 transition-all active:scale-95"
                                title="Public Profile Preview"
                              >
                                 <ExternalLink size={18} />
                              </a>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))
         )}
      </div>

      {/* Super Admin Warning */}
      {!isSuper && (
         <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
               <ShieldAlert size={32} />
            </div>
            <div>
               <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2">Vetting Authority Alert</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-3xl">Standard Administrators can inspect educator credentials and view internal performance metrics but possess restricted permissions for final account verification. The <strong>"Approve Verification"</strong> structural command is reserved for <strong>Super Admins</strong> to maintain high pedagogical standard integrity.</p>
            </div>
         </div>
      )}
    </div>
  );
}
