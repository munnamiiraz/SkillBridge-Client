"use client"
import React, { useState } from 'react';

interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  isOnline: boolean;
  verified: boolean;
  bgGradient: string;
  totalStudents: number;
  bio: string;
}

interface FilterState {
  searchQuery: string;
  selectedSubjects: string[];
  priceRange: [number, number];
  minRating: number | null;
}

const TutorDiscoveryPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedSubjects: [],
    priceRange: [0, 200],
    minRating: null,
  });
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  // Mock data - replace with actual API data
  const mockTutors: Tutor[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      subject: 'Mathematics',
      rating: 4.9,
      reviewCount: 127,
      pricePerSession: 45,
      isOnline: true,
      verified: true,
      bgGradient: 'from-indigo-600 to-purple-600',
      totalStudents: 156,
      bio: 'PhD in Mathematics with 10+ years of teaching experience. I specialize in making complex concepts simple.',
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'MC',
      subject: 'Physics',
      rating: 4.8,
      reviewCount: 89,
      pricePerSession: 50,
      isOnline: true,
      verified: true,
      bgGradient: 'from-blue-600 to-cyan-600',
      totalStudents: 92,
      bio: 'Former NASA engineer, passionate about making physics accessible and fun for everyone.',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'ER',
      subject: 'English Literature',
      rating: 5.0,
      reviewCount: 203,
      pricePerSession: 40,
      isOnline: true,
      verified: true,
      bgGradient: 'from-rose-600 to-orange-600',
      totalStudents: 245,
      bio: 'Published author and literature professor. Let\'s explore the beauty of language together.',
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'DK',
      subject: 'Computer Science',
      rating: 4.7,
      reviewCount: 156,
      pricePerSession: 65,
      isOnline: false,
      verified: true,
      bgGradient: 'from-emerald-600 to-teal-600',
      totalStudents: 112,
      bio: 'Senior software engineer at a top tech company. I teach practical coding and architecture.',
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      avatar: 'LT',
      subject: 'Chemistry',
      rating: 4.9,
      reviewCount: 94,
      pricePerSession: 48,
      isOnline: true,
      verified: true,
      bgGradient: 'from-amber-500 to-orange-600',
      totalStudents: 88,
      bio: 'Biochemist with expertise in organic chemistry. I help students master the periodic table.',
    },
    {
      id: '6',
      name: 'James Wilson',
      avatar: 'JW',
      subject: 'History',
      rating: 4.6,
      reviewCount: 71,
      pricePerSession: 38,
      isOnline: true,
      verified: false,
      bgGradient: 'from-slate-600 to-zinc-700',
      totalStudents: 64,
      bio: 'History professor specializing in World War era. Uncovering the stories that shaped our world.',
    },
  ];

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English Literature',
    'History',
    'Computer Science',
    'Economics',
    'Psychology',
    'Languages',
  ];

  const activeFilterCount = 
    (filters.searchQuery ? 1 : 0) +
    filters.selectedSubjects.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 200 ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedSubjects: [],
      priceRange: [0, 200],
      minRating: null,
    });
  };

  const toggleSubject = (subject: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter(s => s !== subject)
        : [...prev.selectedSubjects, subject],
    }));
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Find Your Perfect Tutor
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Connect with verified experts who match your learning goals.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filter Panel - Desktop */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                subjects={subjects}
                toggleSubject={toggleSubject}
                handleClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Results Section */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Found {mockTutors.length} tutors
                </p>
                {activeFilterCount > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Tutor Grid */}
            {mockTutors.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {mockTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <EmptyState onClearFilters={handleClearFilters} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        type="button"
        onClick={() => setIsMobileFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-white text-indigo-600 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <MobileFilterDrawer
          filters={filters}
          setFilters={setFilters}
          subjects={subjects}
          toggleSubject={toggleSubject}
          handleClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
          onClose={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

// Filter Panel Component
interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  subjects: string[];
  toggleSubject: (subject: string) => void;
  handleClearFilters: () => void;
  activeFilterCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  subjects,
  toggleSubject,
  handleClearFilters,
  activeFilterCount,
}) => {
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const displayedSubjects = showAllSubjects ? subjects : subjects.slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Search by name
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Enter tutor name..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Subject
          </label>
          <div className="flex flex-wrap gap-2">
            {displayedSubjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filters.selectedSubjects.includes(subject)
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
          {subjects.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllSubjects(!showAllSubjects)}
              className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {showAllSubjects ? 'Show less' : `Show ${subjects.length - 6} more`}
            </button>
          )}
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Price per session
          </label>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                ${filters.priceRange[0]}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ${filters.priceRange[1]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex gap-2">
              {[
                { label: 'Budget', max: 30 },
                { label: 'Mid-range', max: 60 },
                { label: 'Premium', max: 200 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, preset.max] }))}
                  className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Minimum rating
          </label>
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? null : rating }))}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  filters.minRating === rating
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{rating}.0 & up</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tutor Card Component
interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  return (
    <article className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)]">
      {/* Card Header with Gradient Background */}
      <div className={`h-24 bg-linear-to-br ${tutor.bgGradient} relative overflow-hidden`}>
        {/* Abstract Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 to-transparent" />
      </div>

      <div className="relative px-6 pb-6 mt-[-3rem]">
        {/* Avatar Section */}
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <div className={`w-24 h-24 rounded-2xl bg-linear-to-br ${tutor.bgGradient} p-1 shadow-lg`}>
              <div className="w-full h-full rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white font-bold text-2xl border-2 border-white dark:border-gray-800 overflow-hidden">
                {tutor.avatar.length > 2 ? (
                  <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                ) : (
                  <span className={`bg-linear-to-br ${tutor.bgGradient} bg-clip-text text-transparent`}>{tutor.avatar}</span>
                )}
              </div>
            </div>
            {/* Status Indicator */}
            {tutor.isOnline && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 border-4 border-white dark:border-gray-800 shadow-sm"></span>
              </div>
            )}
            {/* Verified Badge */}
            {tutor.verified && (
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-gray-800 shadow-sm z-10">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end pb-2">
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-800 shadow-sm">
              <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{tutor.rating}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">({tutor.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 truncate">
              {tutor.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800">
                {tutor.subject}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {tutor.totalStudents} Students
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 min-h-[4.5rem]">
            {tutor.bio}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-0.5">Session Price</p>
              <p className="text-2xl font-black bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                ${tutor.pricePerSession}<span className="text-xs font-medium text-gray-500 dark:text-gray-400">/hr</span>
              </p>
            </div>
            
            <button className="relative group/btn overflow-hidden px-5 py-2.5 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all duration-300">
              <span className="relative z-10 flex items-center gap-2">
                View Profile
                <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// Empty State Component
interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
        <svg
          className="relative w-full h-full text-gray-400 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        No tutors found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
        We couldn't find any tutors matching your current filters. Try adjusting your search criteria.
      </p>
      
      <button
        type="button"
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Clear all filters</span>
      </button>
    </div>
  );
};

// Mobile Filter Drawer Component
interface MobileFilterDrawerProps extends FilterPanelProps {
  onClose: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  filters,
  setFilters,
  subjects,
  toggleSubject,
  handleClearFilters,
  activeFilterCount,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            subjects={subjects}
            toggleSubject={toggleSubject}
            handleClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
};

export default TutorDiscoveryPage;