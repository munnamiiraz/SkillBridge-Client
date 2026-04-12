'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Find a Teacher', href: '/tutors' },
    { label: 'Become a Teacher', href: '/become-tutor' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About Us', href: '/about' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/skillbridge', icon: <Twitter className="w-5 h-5" /> },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/skillbridge', icon: <Linkedin className="w-5 h-5" /> },
    { name: 'Facebook', href: 'https://facebook.com/skillbridge', icon: <Facebook className="w-5 h-5" /> },
    { name: 'Instagram', href: 'https://instagram.com/skillbridge', icon: <Instagram className="w-5 h-5" /> },
  ];

  return (
    <footer className="relative w-full bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Empowering global learning through authentic 1-on-1 connections. Where passion meets expertise.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Navigation</h3>
            <ul className="grid grid-cols-1 gap-4">
              {quickLinks.concat(legalLinks).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Connect With Us</h3>
            <div className="space-y-6">
              <a href="mailto:hello@skillbridge.com" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-indigo-600 transition-colors">hello@skillbridge.com</span>
              </a>
              <a href="tel:+15550000000" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-purple-600 transition-colors">+1 (555) 000-0000</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;