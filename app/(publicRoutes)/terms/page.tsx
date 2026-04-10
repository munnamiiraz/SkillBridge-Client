"use client"
import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
      <h1 className="text-4xl font-black mb-8 dark:text-white">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
        <p>Last updated: April 2026</p>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using SkillBridge, you agree to be bound by these Terms of Service.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Termination</h2>
          <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.</p>
        </section>
      </div>
    </div>
  );
}
