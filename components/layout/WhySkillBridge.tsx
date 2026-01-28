import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WhySkillBridgeSection: React.FC = () => {
  const features: Feature[] = [
    {
      title: 'Vetted Experts Only',
      description: 'Every teacher undergoes rigorous verification. Real credentials, proven experience, authentic results.',
      icon: (
        <svg 
          className="w-6 h-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
      ),
    },
    {
      title: 'Your Schedule, Your Pace',
      description: 'No rigid timelines. Book sessions when it works for you. Learn at a speed that feels right.',
      icon: (
        <svg 
          className="w-6 h-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      ),
    },
    {
      title: 'Quality Over Quantity',
      description: 'Small teacher-to-student ratios. Personalized attention. Deep learning, not surface-level tutorials.',
      icon: (
        <svg 
          className="w-6 h-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
          />
        </svg>
      ),
    },
    {
      title: 'Transparent Pricing',
      description: 'See exactly what you pay. No hidden fees, no surprise charges. Simple, honest, fair.',
      icon: (
        <svg 
          className="w-6 h-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      ),
    },
    {
      title: 'Real-Time Support',
      description: 'Questions? Issues? We are here. Human support, not bots. Responses in minutes, not days.',
      icon: (
        <svg 
          className="w-6 h-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ),
    },
    {
      title: 'Progress That Matters',
      description: 'Track growth with meaningful metrics. Celebrate wins. Build momentum toward real mastery.',
      icon: (
        <svg 
          className="w-6 h-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full py-24 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
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

      {/* Gradient Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Why SkillBridge?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
            We're not another marketplace. We're a platform built on trust, transparency, and genuine human connection.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-x-12 lg:gap-y-16">
          {features.map((feature, index) => (
            <div
              key={`feature-${index}`}
              className="group relative"
            >
              {/* Icon Container */}
              <div className="mb-6 inline-flex p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Subtle Underline Effect */}
              <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-12"></div>
            </div>
          ))}
        </div>

        {/* Bottom Statement */}
        <div className="mt-20 lg:mt-24 max-w-4xl mx-auto text-center">
          <div className="relative p-12 lg:p-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
            {/* Decorative Elements */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full blur-3xl"
              aria-hidden="true"
            ></div>
            <div 
              className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl"
              aria-hidden="true"
            ></div>
            
            <div className="relative z-10">
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                &ldquo;Learning should feel personal, not transactional.&rdquo;
              </blockquote>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                That&apos;s why we built SkillBridge — to connect real students with real teachers, 
                creating real results through authentic, one-on-one learning experiences.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button 
            type="button"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40"
          >
            <span>Experience the Difference</span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhySkillBridgeSection;