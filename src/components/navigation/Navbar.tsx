import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinSense } from '../../context/SkinSenseContext';
import { Menu, X, Sparkles, Star, User, LogOut } from 'lucide-react';

interface NavbarProps {
  embeddedInHero?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ embeddedInHero = false }) => {
  const { setCurrentPage, user, logout } = useSkinSense();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const navLinks = [
    { label: 'Explore', action: () => setCurrentPage('home') },
    { label: 'Your Skin', action: () => setCurrentPage('skin') },
    { label: 'Conditions', action: () => setCurrentPage('results') },
    { label: 'AI Guidance', action: () => setCurrentPage('routine') },
    { label: 'Products', action: () => setCurrentPage('products') },
    { label: 'Diet & Nutrition', action: () => setCurrentPage('diet') },
    { label: 'About', action: () => setCurrentPage('about') },
  ];

  return (
    <>
      <header
        className={`w-full z-40 transition-all duration-300 ${
          embeddedInHero
            ? 'pt-2 pb-6'
            : 'sticky top-3 px-4 sm:px-6 lg:px-12 py-1'
        }`}
      >
        <div
          className={`mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
            embeddedInHero
              ? 'w-full'
              : 'max-w-7xl glass-strong px-6 py-3 rounded-full'
          }`}
        >
          {/* Left: Brand Logo & "Trusted by 10,000+ users" pill */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <span className="font-serif text-2xl sm:text-[1.7rem] tracking-tight text-[#2A2420] font-medium group-hover:opacity-85 transition-opacity">
                SkinSense
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2A2420] text-[#FAF7F0] shadow-sm">
                AI
              </span>
            </button>

            {/* "Trusted by 10,000+ users" pill with 3 overlapping avatar circles */}
            <div className="glass-chip glass-chip-lavender py-0.5 px-2.5">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-white/90 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="User avatar 1"
                />
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-white/90 object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                  alt="User avatar 2"
                />
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-white/90 object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="User avatar 3"
                />
              </div>
              <span className="text-[10px] font-sans font-medium text-[#554A42] flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-[#C5A059] text-[#C5A059]" />
                Trusted by <strong className="text-[#2A2420]">10,000+</strong> users
              </span>
            </div>
          </div>

          {/* Centered Navigation Links with animated underline */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="relative py-1 text-xs font-sans font-medium tracking-wide text-[#554A42] hover:text-[#2A2420] transition-colors group focus:outline-none"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#2A2420] rounded-full transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Outlined Glass "Contact Us" Button */}
            <button
              onClick={() => setShowContactModal(true)}
              className="glass-btn text-xs font-sans font-medium px-3.5 py-2"
            >
              Contact Us
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="glass-chip py-1 px-3 flex items-center gap-1.5 border border-white/60">
                  <div className="w-5 h-5 rounded-full bg-[#E5CA8F]/40 text-[#2A2420] text-[10px] font-bold flex items-center justify-center">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-[#2A2420] max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-full glass hover:bg-white/40 text-[#554A42] hover:text-[#934029] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="glass-btn text-xs font-sans font-medium px-4 py-2 hover:bg-white/50"
              >
                Sign In
              </button>
            )}

            {/* Dark filled "Try the App" Button */}
            <button
              onClick={() => setCurrentPage('analyze')}
              className="group text-xs font-sans font-medium px-4 py-2 rounded-full bg-[#2A2420] hover:bg-[#3D352F] text-[#FAF7F0] shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#E5CA8F] group-hover:rotate-12 transition-transform" />
              <span>Analyze Skin</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center justify-between pt-1">
            <button
              onClick={() => setCurrentPage('analyze')}
              className="text-xs bg-[#2A2420] text-white px-3.5 py-1.5 rounded-full font-medium"
            >
              Analyze Skin
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#2A2420]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 sm:hidden p-4 rounded-3xl glass-strong shadow-xl border border-white/80 flex flex-col gap-2"
            >
              {user && (
                <div className="px-4 py-2 mb-1 flex items-center justify-between border-b border-white/60">
                  <span className="text-xs font-medium text-[#2A2420]">
                    Signed in as <strong>{user.name}</strong>
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-[#934029] font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-left text-sm font-medium text-[#554A42] hover:text-[#2A2420] hover:bg-white/40 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-white/60 flex gap-2">
                {!user && (
                  <button
                    onClick={() => {
                      setCurrentPage('login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-xs glass-btn font-medium text-center"
                  >
                    Sign In
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowContactModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs glass-btn font-medium text-center"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('analyze');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs bg-[#2A2420] text-white rounded-full font-medium text-center shadow-md"
                >
                  Analyze
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Contact Us Glass Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-strong rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/90 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/60">
                <h3 className="font-serif text-2xl font-light text-[#2A2420]">
                  Clinical Advisory Inquiries
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-1 rounded-full hover:bg-white/40 text-[#554A42]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="glass-body text-xs text-[#2A2420] leading-relaxed">
                Connect with our dermatological advisory board or technical integration team for enterprise partnerships and clinical questions.
              </p>

              <div className="p-4 rounded-2xl glass-sub space-y-1 text-xs">
                <span className="font-semibold text-[#2A2420] block">Email Support</span>
                <span className="font-mono text-[#432E63] font-medium">advisory@skinsense.ai</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-6 py-2.5 text-xs font-medium rounded-full bg-[#2A2420] text-white hover:bg-[#3D352F] shadow-sm transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
