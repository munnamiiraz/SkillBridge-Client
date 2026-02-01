'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface Subject {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subject: Subject[];
}

const BecomeTutorPage = () => {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    hourlyRate: 25,
    experience: 0,
    education: '',
    subjectIds: [] as string[],
  });

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push('/login');
      return;
    }

    if (!isSessionLoading && session?.user.role === 'TUTOR') {
      router.push('/tutor/dashboard');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/public/categories');
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [session, isSessionLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'hourlyRate' || name === 'experience' ? Number(value) : value,
    }));
  };

  const toggleSubject = (subjectId: string) => {
    setFormData((prev) => {
      const isSelected = prev.subjectIds.includes(subjectId);
      if (isSelected) {
        return { ...prev, subjectIds: prev.subjectIds.filter((id) => id !== subjectId) };
      } else {
        return { ...prev, subjectIds: [...prev.subjectIds, subjectId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.subjectIds.length === 0) {
      toast.error('Please select at least one subject to teach');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/api/tutor/profile', formData);
      if (response.success) {
        toast.success('Your tutor profile has been created successfully!');
        // Ideally we need to refresh the session since the role changed
        // But for now, we redirect to login to force a session refresh or just dashboard
        router.push('/tutor/dashboard');
        // Force reload to pick up new role in session
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSessionLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Join Our Tutor Community
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Share your knowledge and start earning by helping students worldwide.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
            {/* Headline & Bio */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                Professional Overview
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="headline" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Profile Headline
                  </label>
                  <input
                    type="text"
                    id="headline"
                    name="headline"
                    required
                    placeholder="e.g. Expert Mathematics Tutor with 5 years of experience"
                    value={formData.headline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  />
                  <p className="mt-2 text-xs text-gray-500">Capture attention with a brief summary of your expertise.</p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Professional Biography
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    required
                    rows={5}
                    placeholder="Tell potential students about your background, teaching philosophy, and what they can expect from your sessions..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none"
                  />
                  <p className="mt-2 text-xs text-gray-500">Minimum 10 characters.</p>
                </div>
              </div>
            </div>

            {/* Teaching Experience & Rate */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                Experience & Rates
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Hourly Rate ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="hourlyRate"
                      name="hourlyRate"
                      required
                      min="1"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    required
                    min="0"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="education" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Education & Certifications
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    required
                    placeholder="e.g. B.Sc. in Physics from Stanford University"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Categories & Subjects */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                What will you teach?
              </h2>
              
              <div className="space-y-8">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                      {category.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.subject.map((subject) => (
                        <button
                          key={subject.id}
                          type="button"
                          onClick={() => toggleSubject(subject.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                            formData.subjectIds.includes(subject.id)
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300'
                          }`}
                        >
                          {subject.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up your profile...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                By clicking complete registration, you agree to our Tutor Terms of Service.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeTutorPage;
