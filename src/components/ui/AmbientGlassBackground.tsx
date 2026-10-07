import React from 'react';

/**
 * AmbientGlassBackground
 * 
 * Provides chromatic depth and soft luminous motion behind frosted glass elements:
 * - Warm cream to soft lavender/pearl base gradient
 * - 5 large blurred color blobs drifting in 24-32s loops
 * - Chrome/pearl spheres & iridescent rings with metallic sheen for refraction
 * - Subtle fine-grain texture overlay (opacity ~0.035)
 */
export const AmbientGlassBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-br from-[#FAF7F2] via-[#F4EEF7] to-[#F8F3ED]"
    >
      {/* 1. Drifting Ambient Color Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blob 1: Champagne Gold (Top Left / Hero Behind) */}
        <div
          className="absolute -top-24 -left-24 w-[38rem] h-[38rem] rounded-full animate-drift-1"
          style={{
            background: 'radial-gradient(circle, rgba(229, 202, 143, 0.48) 0%, rgba(229, 202, 143, 0) 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Blob 2: Soft Lavender (Top Right) */}
        <div
          className="absolute top-[8%] -right-20 w-[42rem] h-[42rem] rounded-full animate-drift-2"
          style={{
            background: 'radial-gradient(circle, rgba(199, 181, 228, 0.45) 0%, rgba(199, 181, 228, 0) 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Blob 3: Rose-Beige (Mid Left / Story & Routine) */}
        <div
          className="absolute top-[42%] -left-32 w-[40rem] h-[40rem] rounded-full animate-drift-3"
          style={{
            background: 'radial-gradient(circle, rgba(229, 197, 187, 0.42) 0%, rgba(229, 197, 187, 0) 70%)',
            filter: 'blur(85px)',
          }}
        />

        {/* Blob 4: Pearl-Silver (Mid Right / Routine & Intelligence) */}
        <div
          className="absolute top-[55%] -right-24 w-[38rem] h-[38rem] rounded-full animate-drift-1"
          style={{
            background: 'radial-gradient(circle, rgba(216, 216, 230, 0.52) 0%, rgba(216, 216, 230, 0) 70%)',
            filter: 'blur(85px)',
          }}
        />

        {/* Blob 5: Warm Peach-Champagne (Bottom / Protocols & CTA) */}
        <div
          className="absolute top-[80%] left-[25%] w-[45rem] h-[45rem] rounded-full animate-drift-2"
          style={{
            background: 'radial-gradient(circle, rgba(243, 216, 195, 0.40) 0%, rgba(243, 216, 195, 0) 70%)',
            filter: 'blur(95px)',
          }}
        />
      </div>

      {/* 2. Chrome / Pearl Refraction Accents (visible through frosted glass) */}
      <div className="absolute inset-0">
        {/* Pearl Ring 1: Upper Right */}
        <div
          className="absolute top-[18%] right-[12%] w-64 h-64 rounded-full border-[1.5px] border-white/60 opacity-60"
          style={{
            background: 'radial-gradient(circle, transparent 62%, rgba(255, 255, 255, 0.4) 68%, rgba(217, 203, 235, 0.35) 85%, transparent 100%)',
            boxShadow: '0 0 40px rgba(199, 181, 228, 0.25)',
          }}
        />

        {/* Pearl Sphere 2: Mid Section Behind Routine Cards */}
        <div
          className="absolute top-[48%] left-[18%] w-44 h-44 rounded-full opacity-55"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #F0E8DD 45%, #DCD3E6 80%, #C3B8CE 100%)',
            boxShadow: 'inset -6px -6px 14px rgba(120, 100, 140, 0.2), 0 16px 36px rgba(60, 50, 70, 0.08)',
          }}
        />

        {/* Iridescent Chrome Orbital 3: Lower Section */}
        <div
          className="absolute top-[72%] right-[22%] w-80 h-80 rounded-full border border-white/70 opacity-40"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(229, 202, 143, 0.2) 50%, rgba(199, 181, 228, 0.3) 100%)',
            transform: 'rotate(-25deg) skewX(8deg)',
          }}
        />
      </div>

      {/* 3. Subtle Micro-Grain Texture Overlay (opacity ~0.035) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
