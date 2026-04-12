'use client';

import React, { useEffect, useState } from 'react';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  Database, 
  ShieldAlert,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { kbService, KBEntry } from '@/app/services/kb.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import Skeleton from '@/components/ui/Skeleton';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function KnowledgeBasePage() {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!session) return;

    if ((session.user as any).role !== 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
        return;
    }

    if (!hasFetched.current) {
      fetchKB();
      hasFetched.current = true;
    }
  }, [session, router]);

  const fetchKB = async () => {
    setLoading(true);
    const data = await kbService.getAll();
    setEntries(data);
    setLoading(false);
  };

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsAdding(true);
    const result = await kbService.add(newContent);
    if (result) {
      toast.success('Knowledge synthesized successfully');
      setNewContent('');
      fetchKB();
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to purge this knowledge entry from platform intelligence?')) return;
    
    const success = await kbService.delete(id);
    if (success) {
      toast.success('Knowledge entry purged');
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const filteredEntries = entries.filter(e => 
    e.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pt-6 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
            <Sparkles className="text-indigo-500" size={14} />
            <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-[0.2em]">Platform Intelligence</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter uppercase">AI Knowledge Repository</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
            Governing the logical foundations of the platform's RAG system. 
            All entries here are vectorized and served to the AI assistants for high-fidelity reasoning.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-950 p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
           <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <Database size={24} />
           </div>
           <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{entries.length}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Vectors</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Entry Component */}
        <div className="xl:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="relative mb-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Query knowledge repository..."
                  className="pl-14 h-16 rounded-3xl bg-gray-50 dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-lg shadow-inner"
                />
              </div>

              <div className="space-y-4">
                {loading ? (
                   [1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-3xl" />)
                ) : filteredEntries.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                       <Brain size={32} />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No entries found in platform memory</p>
                  </div>
                ) : (
                  filteredEntries.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="group relative bg-white dark:bg-gray-950 p-8 rounded-4xl border border-gray-100 dark:border-gray-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5"
                    >
                      <div className="flex justify-between items-start gap-6">
                        <div className="space-y-4 flex-1">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl">
                                 <Layers size={14} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry ID: {entry.id.slice(0, 8)}...</span>
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold ml-auto">
                                 <Calendar size={12} />
                                 {new Date(entry.createdAt).toLocaleDateString()}
                              </div>
                           </div>
                           <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                              {entry.content}
                           </p>
                        </div>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          className="opacity-0 group-hover:opacity-100 p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input Sidebar */}
        <div className="space-y-8">
           <Card className="rounded-[3rem] border-none shadow-2xl bg-linear-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px]"></div>
              
              <CardContent className="p-10 relative z-10 space-y-10">
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-indigo-200">
                       <Brain className="animate-pulse" size={18} />
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Core Intelligence</span>
                    </div>
                    <h3 className="text-3xl font-bold uppercase tracking-tighter leading-tight">Knowledge Synthesis</h3>
                    <p className="text-indigo-100/60 text-[13px] font-medium leading-relaxed italic">
                      "Inject new logic into the platform's neural infrastructure."
                    </p>
                 </div>

                 <form onSubmit={handleAddKnowledge} className="space-y-8">
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-200/80">Raw Context Data</label>
                          <span className="text-[9px] font-bold text-white/30">{newContent.length} characters</span>
                       </div>
                       <textarea 
                         value={newContent}
                         onChange={e => setNewContent(e.target.value)}
                         className="w-full h-56 bg-white/5 border border-white/10 rounded-4xl p-8 text-[13px] font-bold leading-relaxed focus:bg-white/10 focus:border-white/30 focus:shadow-2xl focus:shadow-white/5 transition-all outline-hidden resize-none placeholder:text-white/20 shadow-inner"
                         placeholder="Synthesize new platform logic, strategic parameters, or high-fidelity context..."
                       />
                    </div>

                    <Button 
                      disabled={isAdding || !newContent.trim()}
                      className="group w-full h-16 rounded-3xl bg-white text-indigo-700 hover:bg-white/90 font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-500/20 disabled:opacity-40 transition-all active:scale-[0.98] overflow-hidden relative"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {isAdding ? (
                          <>
                            <div className="w-5 h-5 border-3 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                            <span className="animate-pulse">Synthesizing...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                            Sythesize Knowledge
                          </>
                        )}
                      </div>
                    </Button>
                 </form>

                 <div className="p-8 rounded-4xl bg-black/30 border border-white/5 backdrop-blur-md space-y-4">
                    <div className="flex items-center gap-3 text-indigo-300">
                       <div className="p-1.5 rounded-lg bg-indigo-500/20">
                          <Info size={12} />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.15em]">System Protocol</span>
                    </div>
                    <p className="text-[11px] font-bold text-indigo-100/40 leading-relaxed italic">
                       Synthesis operations trigger a high-priority vectorization sequence. Ensure objective clarity for optimal AI retrieval.
                    </p>
                 </div>
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 p-8 shadow-sm">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                    <ShieldAlert size={20} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-tight text-gray-900 dark:text-white">Strict Governance</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                       Only users with <span className="text-amber-500 font-bold">Structural Authority (Super Admin)</span> can modify the knowledge repository. All deletions are final and purge associated vector embeddings.
                    </p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
