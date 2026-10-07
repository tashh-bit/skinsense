import React from 'react';
import { useSkinSense } from '../../context/SkinSenseContext';
import { Page } from '../../types';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useSkinSense();

  const links: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Analyze', page: 'analyze' },
    { label: 'Your Skin', page: 'skin' },
    { label: 'Routine', page: 'routine' },
    { label: 'Products (INR)', page: 'products' },
    { label: 'Diet & Nutrition', page: 'diet' },
    { label: 'Account / Login', page: 'login' },
    { label: 'History', page: 'history' },
    { label: 'About', page: 'about' },
  ];

  return (
    <footer className="w-full bg-[#2A2420]/90 backdrop-blur-2xl text-[#FAF7F0] pt-16 pb-12 mt-24 border-t border-white/15">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl tracking-tight text-[#FAF7F0]">SkinSense</span>
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-[#E5CA8F]">
                AI
              </span>
            </div>
            <p className="font-sans text-sm text-[#DDD5CB] max-w-md leading-relaxed">
              Where dermatological science meets computer vision. SkinSense AI interprets dermal topography, lipid equilibrium, and cellular hydration to curate bespoke, evolving skincare protocols.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] font-mono text-[#A69B90] tracking-wider uppercase border border-white/15 rounded-full px-3 py-1">
                Precision Skin Telemetry • v1.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#E5CA8F]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#DDD5CB]">
              {links.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => setCurrentPage(link.page)}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Disclaimer */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#E5CA8F]">
              Ethical Advisory
            </h4>
            <p className="font-sans text-xs text-[#A69B90] leading-relaxed">
              SkinSense AI offers informational cosmetic analysis and routine curation based on optical feature mapping. It does not provide medical diagnosis or replace clinical dermatological consultation.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A69B90] gap-4">
          <p>© {new Date().getFullYear()} SkinSense AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Client-Side Privacy Protected</span>
            <span>Zero Unconsented Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
