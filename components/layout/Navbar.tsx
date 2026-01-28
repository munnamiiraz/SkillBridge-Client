'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check for user's theme preference
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks: NavLink[] = [
    { label: 'Find Teachers', href: '/teachers' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800'
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      {/* Background Pattern (visible when not scrolled) */}
      {!scrolled && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
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
      )}

      {/* Gradient Orbs (subtle) */}
      {!scrolled && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-5"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                SkillBridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                <span>{link.label}</span>
                {/* Underline Effect */}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle theme"
            >
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* Become a Teacher Button */}
            <Link
              href="/teach"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Become a Teacher
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signup"
              className="group relative px-6 py-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {!isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-[500px] opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="relative px-6 pt-4 pb-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          {/* Background Pattern for Mobile Menu */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.01]"
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

          <div className="relative z-10 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                <svg 
                  className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            ))}
            
            <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/teach"
                className="block px-4 py-3 text-base font-medium text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Become a Teacher
              </Link>
              <Link
                href="/signup"
                className="group flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-white bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Get Started</span>
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;