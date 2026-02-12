export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-500">
      <div className="relative flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
        
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-b-purple-500/50 animate-[spin_1.5s_linear_infinite_reverse]"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] animate-pulse"></div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent animate-pulse tracking-tight">
            SkillBridge
          </p>
          <div className="flex items-center gap-1 mt-1 justify-center">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
    </div>
  );
}
