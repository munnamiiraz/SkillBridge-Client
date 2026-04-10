"use client"
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
      <h1 className="text-4xl font-black mb-8 dark:text-white">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
        <p>Last updated: April 2026</p>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
        </section>
      </div>
    </div>
  );
}
