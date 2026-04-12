'use client';

import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  ShieldCheck, 
  Calendar,
  Key,
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { adminService } from '@/app/services/admin.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    image: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await adminService.getProfile();
      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          image: data.image || ''
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updated = await adminService.updateProfile(formData);
    if (updated) {
      setProfile({ ...profile, ...updated });
      toast.success('Administrative identity updated');
    } else {
      toast.error('Failed to sync changes with server');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-48 rounded-[3rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="h-[400px] rounded-3xl" />
           <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!profile) return <div>Failed to load profile context.</div>;

  const isSuper = profile.role === 'SUPER_ADMIN';

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Profile Header Banner */}
      <div className="relative h-64 rounded-[3rem] bg-linear-to-br from-indigo-900 via-indigo-600 to-purple-600 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
        
        <div className="absolute -bottom-12 left-12 flex items-end gap-8">
          <div className="relative group">
            <div className={`absolute -inset-2 bg-linear-to-tr ${isSuper ? 'from-amber-400 to-amber-600' : 'from-indigo-400 to-purple-500'} rounded-[2.5rem] opacity-30 group-hover:opacity-60 blur-xl transition-opacity`} />
            <div className="relative w-40 h-40 rounded-[2.2rem] bg-white dark:bg-gray-800 border-[6px] border-white dark:border-gray-900 shadow-2xl overflow-hidden group">
              {formData.image ? (
                <img src={formData.image} alt="Admin Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-6xl font-bold text-indigo-200">
                  {profile.name?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-sm">
                <Camera size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Update Photo</span>
              </button>
            </div>
          </div>
          
          <div className="mb-14">
             <h2 className="text-4xl font-bold text-white tracking-tighter drop-shadow-md">
               {profile.name}
             </h2>
             <div className="flex items-center gap-3 mt-2">
               <div className={`px-4 py-1.5 rounded-2xl backdrop-blur-md border ${
                 isSuper ? 'bg-amber-500/20 border-amber-500/40 text-amber-200' : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200'
               } flex items-center gap-2 text-xs font-bold uppercase tracking-tighter`}>
                 {isSuper ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                 {profile.role.replace('_', ' ')}
               </div>
               <div className="px-4 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                 <Calendar size={14} />
                 Joined {new Date(profile.createdAt).toLocaleDateString()}
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Identity Details Sidebar */}
        <div className="space-y-8">
           <Card className="rounded-[2.5rem] overflow-hidden shadow-sm">
              <CardHeader className="bg-gray-50/50 dark:bg-white/5">
                 <CardTitle className="text-sm">Technical Identity</CardTitle>
                 <CardDescription>Persistent system-wide identifiers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                 <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                       <Mail size={18} />
                    </div>
                    <div className="min-w-0">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Primary Email</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{profile.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                       <ShieldCheck size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Access Level</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white">{isSuper ? 'Unlimited Structural' : 'Intermediate Operational'}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-none bg-linear-to-br from-indigo-600/5 to-purple-600/5 shadow-sm">
              <CardContent className="p-8">
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                    <Key size={16} /> Security Settings
                 </h4>
                 <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-indigo-500/50 transition-all group active:scale-[0.98]">
                       Rotate Password
                       <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-indigo-500/50 transition-all group active:scale-[0.98]">
                       Manage Auth Devices
                       <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Edit Form Main Area */}
        <div className="lg:col-span-2">
           <Card className="rounded-[2.5rem] shadow-xl border-gray-100/50 dark:border-gray-800/50">
              <CardHeader className="border-b border-gray-50 dark:border-white/5 bg-gray-50/20 dark:bg-white/5">
                 <CardTitle className="tracking-tighter">Edit Identity Profile</CardTitle>
                 <CardDescription>Update your public-facing information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                 <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Full Display Name</label>
                       <Input 
                         value={formData.name} 
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         placeholder="e.g. Alexander Pierce"
                         className="rounded-2xl h-14"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Contact Number</label>
                       <Input 
                         value={formData.phone} 
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                         placeholder="+1 (555) 000-0000"
                         className="rounded-2xl h-14"
                       />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Operational Address</label>
                       <Input 
                         value={formData.address} 
                         onChange={e => setFormData({...formData, address: e.target.value})}
                         placeholder="123 Admin Lane, Headquarters, CA"
                         className="rounded-2xl h-14"
                       />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Gravatar / Image URL</label>
                       <Input 
                         value={formData.image} 
                         onChange={e => setFormData({...formData, image: e.target.value})}
                         placeholder="https://images.unsplash.com/..."
                         className="rounded-2xl h-14"
                       />
                    </div>
                    
                    <div className="md:col-span-2 pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                       <button 
                         type="submit" 
                         disabled={saving}
                         className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-bold uppercase text-xs tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                       >
                         {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                         {saving ? 'Syncing...' : 'Save Operations Identity'}
                       </button>
                    </div>
                 </form>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
