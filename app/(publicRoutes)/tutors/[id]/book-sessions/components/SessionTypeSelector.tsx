type SessionType = 'single' | 'package';

interface SessionTypeSelectorProps {
  sessionType: SessionType;
  setSessionType: (type: SessionType) => void;
}

export const SessionTypeSelector: React.FC<SessionTypeSelectorProps> = ({ sessionType, setSessionType }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Choose Session Type
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSessionType('single')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
            sessionType === 'single'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
          }`}
        >
          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
            sessionType === 'single'
              ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className={`font-bold text-center ${
            sessionType === 'single'
              ? 'text-indigo-700 dark:text-indigo-300'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            Single Session
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-1">
            Book one session
          </p>
        </button>

        <button
          onClick={() => setSessionType('package')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
            sessionType === 'package'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
          }`}
        >
          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
            sessionType === 'package'
              ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="relative inline-block">
            <p className={`font-bold text-center ${
              sessionType === 'package'
                ? 'text-purple-700 dark:text-purple-300'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              Session Package
            </p>
            <span className="absolute -top-1 -right-8 px-1.5 py-0.5 bg-purple-500 text-[10px] text-white font-bold rounded flex items-center justify-center whitespace-nowrap">
              SOON
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-1">
            Save with bundles
          </p>
        </button>
      </div>
    </div>
  );
};
