import Link from 'next/link';

interface HeaderProps {
  tutorId: string;
  tutor: {
    name: string;
    avatar: string;
    subject: string;
    rating: number;
    bgGradient: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ tutorId, tutor }) => {
  return (
    <div className="mb-8">
      <Link 
        href={`/tutors/${tutorId}`}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Profile
      </Link>

      <div className="flex items-center gap-6">
        <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${tutor.bgGradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg overflow-hidden`}>
          {tutor.avatar.length > 1 ? (
            <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
          ) : (
            tutor.avatar
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Book a Session with {tutor.name}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <span className="font-semibold">{tutor.subject}</span>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span className="font-semibold text-gray-900 dark:text-white">{tutor.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
