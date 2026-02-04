"use client"
import React from 'react';

interface SaveBarProps {
  onSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export const SaveBar: React.FC<SaveBarProps> = ({ onSave, isSaving, saveSuccess }) => {
  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="text-center sm:text-left">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your time ranges will be converted to 1-hour bookable slots automatically.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {saveSuccess && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-fade-in">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Saved successfully!</span>
          </div>
        )}
        
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Availability</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
