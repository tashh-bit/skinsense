import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSkinSense } from '../../context/SkinSenseContext';
import { useMotion } from '../motion/MotionProvider';
import { ScanOverlay } from './ScanOverlay';
import { StatsColumn } from './StatsColumn';
import { Navbar } from '../navigation/Navbar';
import { analyzeSkinImage } from '../../lib/analyzer';
import { Sparkles, ArrowRight, Upload, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentPage, saveNewAnalysis } = useSkinSense();
  const { normX, normY, isTouchDevice, reducedMotion } = useMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingDirectUpload, setIsProcessingDirectUpload] = useState(false);

  // Staggered words for headline: "Unlock your skin's potential"
  const headlineWords = ['Unlock', 'your', "skin's", 'potential'];

  // Handle direct image upload from Hero CTA
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsProcessingDirectUpload(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const imageSrc = event.target.result as string;
        try {
          const result = await analyzeSkinImage(imageSrc);
          saveNewAnalysis(result);
          setIsProcessingDirectUpload(false);
          setCurrentPage('results');
        } catch (err) {
          console.error('Direct scan error:', err);
          setIsProcessingDirectUpload(false);
          setCurrentPage('analyze');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="relative w-full py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-10 bg-transparent overflow-hidden">
      
      {/* Hidden file input for direct instant analysis */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Rounded Glass Card Container on soft drifting ambient scene */}
      <div className="relative max-w-[1360px] mx-auto rounded-[2.5rem] lg:rounded-[3.25rem] glass p-6 sm:p-10 lg:p-12 shadow-card-lavender border border-white/80 overflow-hidden">
        
        {/* Top Navbar embedded directly in the card header */}
        <Navbar embeddedInHero={true} />

        {/* Hero 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center pt-6 lg:pt-8">
          
          {/* ================= LEFT COLUMN: HEADLINE & CTA (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 z-10 text-left">
            
            {/* Headline with Staggered Word-by-Word Reveal */}
            <div className="space-y-1">
              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-light text-[#2A2420] leading-[1.08] tracking-tight">
                {headlineWords.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden mr-2.5 sm:mr-3">
                    <motion.span
                      initial={{ y: '105%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: 0.85,
                        delay: 0.15 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`inline-block ${
                        word === "skin's" ? 'italic font-normal font-serif text-[#5B3E84]' : ''
                      }`}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>
            </div>

            {/* Short Subtext with WCAG AA compliance */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: 'easeOut' }}
              className="font-sans text-sm sm:text-base text-[#554A42] max-w-sm leading-relaxed"
            >
              Our AI scans your face and shows what can be improved. Receive clinically-grounded barrier diagnostics and customized AM/PM formulations.
            </motion.p>

            {/* Soft Lavender "Analyze Skin" CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 pt-2"
            >
              <div className="flex flex-wrap items-center gap-3">
                {/* Main Soft Lavender CTA with Idle Shimmer, Lift + Glow, and Press Scale */}
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  onClick={() => {
                    setCurrentPage('analyze');
                  }}
                  disabled={isProcessingDirectUpload}
                  className="relative group overflow-hidden px-8 py-4 rounded-full font-sans font-medium text-sm text-[#382657] bg-[#D8CAF0] hover:bg-[#CDBBEA] shadow-soft hover:shadow-glow-lavender transition-all duration-300 flex items-center gap-2.5 border border-[#C7B5E4]/80 active:shadow-inner"
                >
                  {/* Soft idle shimmer sweep */}
                  {!reducedMotion && (
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none" />
                  )}

                  {isProcessingDirectUpload ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-[#4F3978] border-t-transparent animate-spin" />
                      <span>Scanning facial matrix...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#5B3E84] group-hover:rotate-12 transition-transform duration-300" />
                      <span className="tracking-wide">Analyze Skin</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </motion.button>

                {/* Instant Upload Option with Glass Button styling */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-btn px-5 py-3 rounded-full text-xs font-sans text-[#2A2420] flex items-center gap-1.5"
                  title="Upload face photo directly"
                >
                  <Upload className="w-3.5 h-3.5 text-[#5B3E84]" />
                  <span>Upload Image</span>
                </button>
              </div>

              {/* Sub-label */}
              <p className="font-mono text-[10px] text-[#554A42] flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5440]" />
                <span>Instant client-side scan • No account required</span>
              </p>
            </motion.div>

          </div>

          {/* ================= CENTER COLUMN: LARGE FACE PORTRAIT WITH AI SCAN OVERLAY (5 Cols) ================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Subtle mouse parallax container */}
            <motion.div
              style={{
                x: isTouchDevice || reducedMotion ? 0 : normX.get() * -8,
                y: isTouchDevice || reducedMotion ? 0 : normY.get() * -6,
              }}
              className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[3/4] mx-auto rounded-[2.5rem] overflow-hidden group shadow-lg"
            >
              {/* Portrait Image with soft gradient fade at the bottom and edges */}
              <img
                src="/assets/hero-face.png"
                alt="AI Skin Analysis Portrait"
                className="w-full h-full object-cover object-top filter saturate-[0.98] contrast-[1.02] select-none"
                loading="eager"
              />

              {/* Soft white gradient fade at bottom and edges so it blends cleanly into the glass card */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 95% 85% at 50% 40%, transparent 60%, rgba(255,255,255,0.3) 80%, rgba(255,255,255,0.85) 98%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/90 via-white/60 to-transparent pointer-events-none" />

              {/* The Signature Feature: Animated AI Scan Overlay on the Face */}
              <ScanOverlay />

              {/* Status pill in bottom corner */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
                <div className="glass-chip px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#2A2420] flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B3E84] animate-ping" />
                  <span>Optical AI Scan Active</span>
                </div>
                <span className="glass-chip text-[10px] font-mono text-[#554A42]">
                  102.4k points
                </span>
              </div>
            </motion.div>

          </div>

          {/* ================= RIGHT COLUMN: VERTICAL STATS COLUMN (3 Cols) ================= */}
          <div className="lg:col-span-3">
            <StatsColumn />
          </div>

        </div>

      </div>
    </section>
  );
};
