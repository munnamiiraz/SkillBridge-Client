export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm transition-all">
      <div className="flex flex-col items-center gap-4">
        {/* Sleek Minimalist Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse tracking-wide">
          Loading SkillBridge...
        </p>
      </div>
    </div>
  );
}
