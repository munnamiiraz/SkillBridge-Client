'use client';

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type UserRole = 'STUDENT' | 'TUTOR';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: role,
      } as any, {
        onSuccess: () => {
          toast.success('Registration successful! Please check your email for verification.');
          router.push('/login');
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Registration failed');
        }
      });

      if (error) {
        console.error('Registration error:', error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      {/* Registration Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 sm:p-10 text-center border-b border-gray-200 dark:border-gray-800">
            {/* Logo/Brand */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              SB
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join SkillBridge and start your learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
            
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                I want to join as a <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Student Option */}
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    role === 'STUDENT'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600'
                  }`}
                >
                  {/* Radio Indicator */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      role === 'STUDENT'
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {role === 'STUDENT' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    role === 'STUDENT'
                      ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>

                  <p className={`font-semibold text-center ${
                    role === 'STUDENT'
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Student
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
                    Learn new skills
                  </p>
                </button>

                {/* Tutor Option */}
                <button
                  type="button"
                  onClick={() => setRole('TUTOR')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    role === 'TUTOR'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                >
                  {/* Radio Indicator */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      role === 'TUTOR'
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {role === 'TUTOR' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    role === 'TUTOR'
                      ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>

                  <p className={`font-semibold text-center ${
                    role === 'TUTOR'
                      ? 'text-purple-700 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Tutor
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
                    Teach & earn
                  </p>
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 dark:text-white">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Must be at least 8 characters with letters and numbers
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!role || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                role && !isLoading
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              } flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>

          {/* Footer */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Free to join</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.7;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;