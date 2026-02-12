import Link from "next/link";

interface HeaderProps {
  tutorId: string;
  tutorName: string;
}

export const Header: React.FC<HeaderProps> = ({ tutorId, tutorName }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Link
          href={`/tutors/${tutorId}`}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 mb-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reviews for {tutorName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          See what students are saying about their learning experience.
        </p>
      </div>
      <div className="hidden sm:block">
        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};