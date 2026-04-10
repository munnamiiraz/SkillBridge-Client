"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  BookOpen, 
  DollarSign, 
  Star, 
  MessageSquare,
  Sparkles,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FilterState {
  searchQuery: string;
  selectedSubjects: string[];
  priceRange: [number, number];
  minRating: number | null;
  minTotalReviews: number | null;
  category: string | null;
}

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  subjects: string[];
  toggleSubject: (subject: string) => void;
  handleClearFilters: () => void;
  activeFilterCount: number;
  categories: any[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  subjects,
  toggleSubject,
  handleClearFilters,
  activeFilterCount,
  categories,
}) => {
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const displayedSubjects = showAllSubjects ? subjects : subjects.slice(0, 6);

  return (
    <div className="relative overflow-hidden bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 p-8 shadow-xl shadow-indigo-500/5">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">Filters</h2>
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="group flex items-center gap-1.5 text-xs font-black text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-widest"
            >
              <RotateCcw size={14} className="group-hover:-rotate-45 transition-transform" />
              Reset
            </button>
          )}
        </div>

        <div className="space-y-10">
          {/* Search Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
              <Search size={12} />
              <span>Search Tutor</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
              <input
                type="text"
                id="search"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Find by name..."
                className="relative w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-900 transition-all shadow-sm font-semibold"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
              <Layers size={12} />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, category: prev.category === category.name ? null : category.name }))}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-300 border ${
                    filters.category === category.name
                      ? 'bg-linear-to-br from-indigo-600 to-purple-600 border-transparent text-white shadow-lg shadow-indigo-500/30 active:scale-95'
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-indigo-200 dark:hover:border-indigo-900'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
              <BookOpen size={12} />
              <span>Subjects</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayedSubjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSubject(subject)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-300 border ${
                    filters.selectedSubjects.includes(subject)
                      ? 'bg-linear-to-br from-indigo-600 to-purple-600 border-transparent text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-indigo-200 dark:hover:border-indigo-900'
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
                className="flex items-center gap-1 mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
              >
                {showAllSubjects ? (
                  <>Show less <ChevronUp size={14} /></>
                ) : (
                  <>Show {subjects.length - 6} more <ChevronDown size={14} /></>
                )}
              </button>
            )}
          </div>

          {/* Price Range */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
              <DollarSign size={12} />
              <span>Pricing</span>
            </div>
            <div className="space-y-6 px-1 pt-2">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                  className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold block leading-none">Min</span>
                  <span className="font-black text-gray-900 dark:text-white">$0</span>
                </div>
                <div className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-right">
                  <span className="text-[10px] text-indigo-400 font-bold block leading-none">Max</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Filter Slider/Buttons */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
              <Star size={12} />
              <span>Minimum Quality</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[5, 4, 3].map((rating) => {
                const isSelected = filters.minRating === rating;
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, minRating: isSelected ? null : rating }))}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 border ${
                      isSelected
                        ? 'bg-linear-to-br from-indigo-600 to-purple-600 border-transparent text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${i < rating ? (isSelected ? 'text-white fill-current' : 'text-yellow-400 fill-current') : 'text-gray-200 dark:text-gray-700'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-black tracking-tight">{rating}.0 & up</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reviews Filter */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
              <MessageSquare size={12} />
              <span>Reviews</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[0, 10, 20, 50].map((count) => {
                const isSelected = (filters.minTotalReviews === count || (!filters.minTotalReviews && count === 0));
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, minTotalReviews: count || null }))}
                    className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                      isSelected
                        ? 'bg-linear-to-br from-indigo-600 to-purple-600 border-transparent text-white shadow-lg'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {count === 0 ? 'Any' : `${count}+`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
