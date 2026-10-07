import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, DetectedCondition } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { AnimatedCounter } from '../motion/AnimatedCounter';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  Info,
  X,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { useSkinSense } from '../../context/SkinSenseContext';

interface ProductShowcaseSliderProps {
  products: Product[];
  activeCondition?: DetectedCondition;
  collectionTitle?: string;
}

export const ProductShowcaseSlider: React.FC<ProductShowcaseSliderProps> = ({
  products,
  activeCondition = 'general_barrier',
  collectionTitle = 'Dermatological Edit 2026',
}) => {
  const { wishlist, toggleWishlist } = useSkinSense();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Normalize index if products list changes via filters
  useEffect(() => {
    setCurrentIndex((prev) => (products.length > 0 ? Math.min(prev, products.length - 1) : 0));
  }, [products.length]);

  const total = products.length;
  const activeProduct = products[currentIndex] || products[0];

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedModalProduct) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, selectedModalProduct]);

  // Wheel handling (debounced horizontal swipe)
  const wheelLockRef = useRef(false);
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLockRef.current) return;
    if (Math.abs(e.deltaX) > 28 || Math.abs(e.deltaY) > 40) {
      wheelLockRef.current = true;
      if (e.deltaX > 0 || e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 700);
    }
  };

  // Drag / Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = e.changedTouches[0].clientX - dragStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) handleNext();
      else handlePrev();
    }
    setDragStartX(null);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (!activeProduct) {
    return null;
  }

  // Trail of 2 previous items (on left)
  const trailProducts = [
    products[(currentIndex - 2 + total) % total],
    products[(currentIndex - 1 + total) % total],
  ].filter(Boolean);

  // Column of 2-3 related items (on right, excluding active)
  const relatedProducts = [
    products[(currentIndex + 1) % total],
    products[(currentIndex + 2) % total],
    products[(currentIndex + 3) % total],
  ].filter((p) => p && p.id !== activeProduct.id).slice(0, 3);

  const isWishlisted = wishlist.includes(activeProduct.id);

  const getReason = (prod: Product) => {
    if (prod.suits_conditions.includes('acne')) {
      return 'Microcomedone clearing without stripping hydrolipid mantle.';
    }
    if (prod.suits_conditions.includes('eczema')) {
      return 'Biomimetic ceramide matrix lowering trans-epidermal water loss.';
    }
    if (prod.suits_conditions.includes('pigmentation')) {
      return 'Tyrosinase inhibition attenuating UV-induced melanin clusters.';
    }
    return 'Optimizes epidermal cellular barrier resilience and moisture binding.';
  };

  const padNum = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <div
      ref={sliderRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-cursor="drag"
      className="relative w-full rounded-[2.5rem] lg:rounded-[3rem] glass p-6 sm:p-10 border border-white/80 shadow-2xl overflow-hidden select-none"
    >
      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/60">
        <div className="space-y-1">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#8C6D2B] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E5CA8F]" />
            Collection Reel
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#2A2420]">
            {collectionTitle}
          </h2>
        </div>

        {/* Counter and Navigation Arrows */}
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs sm:text-sm text-[#2A2420] glass-chip px-3 py-1.5 border border-white/80">
            <strong>{padNum(currentIndex + 1)}</strong> / {padNum(total)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              title="Previous formulation (ArrowLeft)"
              className="p-2.5 rounded-full glass-btn text-[#2A2420] hover:bg-white/60 transition-all hover:scale-105 active:scale-95"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              title="Next formulation (ArrowRight)"
              className="p-2.5 rounded-full glass-btn text-[#2A2420] hover:bg-white/60 transition-all hover:scale-105 active:scale-95"
              aria-label="Next product"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN REEL DISPLAY (3 COLUMNS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
        
        {/* LEFT COLUMN: TRAIL OF 2 PREVIOUS PRODUCTS (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-5 items-end justify-center opacity-75">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#554A42] w-full text-right pr-2">
            Previous Formulations
          </span>
          {trailProducts.map((p, idx) => (
            <motion.div
              key={p.id}
              onClick={() => setCurrentIndex((currentIndex - (trailProducts.length - idx) + total) % total)}
              whileHover={{ scale: 1.04, opacity: 1 }}
              className="w-48 p-3 rounded-2xl glass-sub border border-white/70 shadow-sm cursor-pointer flex items-center gap-3 transition-all"
            >
              <div className="w-14 h-18 rounded-xl bg-white/40 p-1 flex items-center justify-center shrink-0">
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name} ${p.size}`}
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <div className="space-y-0.5 overflow-hidden text-left">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#8C6D2B] block">
                  {p.brand}
                </span>
                <h4 className="font-serif text-xs text-[#2A2420] truncate">
                  {p.name}
                </h4>
                <span className="font-mono text-[11px] font-semibold text-[#2A2420] block">
                  {formatINR(p.price_inr)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CENTER STAGE: ACTIVE PRODUCT LARGE CUT-OUT WITH IDLE FLOAT & PARALLAX */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div
            onClick={() => setSelectedModalProduct(activeProduct)}
            data-cursor="scan"
            className="group relative w-full max-w-sm aspect-[4/5] rounded-[2.5rem] p-6 glass-sub border border-white/90 shadow-xl flex flex-col items-center justify-between cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl"
          >
            {/* Click to expand pill */}
            <div className="absolute top-4 right-4 z-20 glass-chip text-[10px] font-mono text-[#2A2420] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3 h-3 text-[#8C6D2B]" />
              <span>Inspect Dossier</span>
            </div>

            {/* Active Product Cutout Image with Idle Breathing Float */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, x: 40, scale: 0.92 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  y: [0, -8, 0],
                }}
                exit={{ opacity: 0, x: -40, scale: 0.9 }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                className="relative w-full h-64 sm:h-76 my-auto flex items-center justify-center p-2"
              >
                <img
                  src={activeProduct.image}
                  alt={`${activeProduct.brand} ${activeProduct.name} ${activeProduct.size}`}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </AnimatePresence>

            {/* Bottom Floating Pill inside cutout frame */}
            <div className="w-full pt-2 flex items-center justify-between text-xs border-t border-white/50">
              <span className="glass-chip text-[10px] font-mono uppercase tracking-wider text-[#2A2420]">
                {activeProduct.category}
              </span>
              <span className="font-mono text-[11px] text-[#554A42]">
                {activeProduct.size}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE INFO BLOCK & 2-3 RELATED ITEMS */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Active Product Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-widest text-[#8C6D2B] font-semibold block">
                  {activeProduct.brand}
                </span>
                <h3 className="editorial-heading text-2xl sm:text-3xl font-light text-[#2A2420] leading-tight">
                  {activeProduct.name}
                </h3>
              </div>

              {/* Price with Count-Up and Indian Rupee Formatting */}
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#2A2420] tracking-tight">
                  ₹<AnimatedCounter value={activeProduct.price_inr} duration={900} />
                </span>
                <span className="font-mono text-[10px] text-[#554A42]">
                  Price as of {activeProduct.price_checked_date}, may vary
                </span>
              </div>

              {/* Key Actives Chips */}
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#554A42] block">
                  Key Bioactive Matrix
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProduct.key_ingredients.map((ing, i) => (
                    <span key={i} className="glass-chip glass-chip-warm font-mono text-[11px]">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why This Suits You */}
              <div className="p-3.5 rounded-2xl glass-sub text-xs space-y-1 border border-white/70">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C6D2B] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#3D5440]" />
                  Why This Suits You
                </span>
                <p className="font-sans text-xs text-[#2A2420] leading-relaxed">
                  {getReason(activeProduct)}
                </p>
              </div>

              {/* Actions: Buy on Store + Wishlist */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={activeProduct.product_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex-1 py-3 px-5 rounded-full bg-[#2A2420] hover:bg-[#3D352F] text-white text-xs font-medium text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Buy on {activeProduct.store || 'Nykaa'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#E5CA8F]" />
                </a>

                <button
                  onClick={() => toggleWishlist(activeProduct.id)}
                  className={`p-3 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                      : 'glass-btn text-[#554A42]'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Related Formulations Column */}
          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-white/60 space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#554A42] block">
                Related Formulations
              </span>
              <div className="flex flex-col gap-2">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      const idx = products.findIndex((prod) => prod.id === p.id);
                      if (idx !== -1) setCurrentIndex(idx);
                    }}
                    className="p-2.5 rounded-xl glass-sub hover:bg-white/50 border border-white/70 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-white/40 p-0.5 shrink-0">
                        <img
                          src={p.image}
                          alt={`${p.brand} ${p.name} ${p.size}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="truncate">
                        <span className="font-serif text-xs text-[#2A2420] block truncate">
                          {p.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#554A42]">
                          {p.brand} ({p.size})
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#2A2420] shrink-0 pl-2">
                      {formatINR(p.price_inr)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ================= BOTTOM PROGRESS BAR ================= */}
      <div className="mt-4 pt-4 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#554A42]">
        <div className="w-full sm:w-1/2 bg-white/50 h-1.5 rounded-full overflow-hidden border border-white/40">
          <motion.div
            className="h-full bg-[#2A2420] rounded-full"
            animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <p className="font-sans text-[11px] text-[#554A42] text-center sm:text-right">
          Product suggestions are general, not medical advice. Patch-test new products.
        </p>
      </div>

      {/* ================= DETAIL MODAL ON CLICK ================= */}
      <AnimatePresence>
        {selectedModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-strong rounded-[32px] p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-white/90 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/60">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C6D2B]">
                    {selectedModalProduct.brand} � {selectedModalProduct.category}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#2A2420]">
                    {selectedModalProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedModalProduct(null)}
                  className="p-2 rounded-full hover:bg-white/40 text-[#2A2420]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-44 h-56 rounded-2xl bg-white/40 p-4 border border-white/80 shrink-0 flex items-center justify-center">
                  <img
                    src={selectedModalProduct.image}
                    alt={`${selectedModalProduct.brand} ${selectedModalProduct.name} ${selectedModalProduct.size}`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                </div>

                <div className="space-y-3 flex-1 text-xs text-[#2A2420]">
                  <div>
                    <span className="font-mono text-xl font-bold text-[#2A2420]">
                      {formatINR(selectedModalProduct.price_inr)}
                    </span>
                    <span className="font-mono text-[10px] text-[#554A42] block">
                      Bottle Size: {selectedModalProduct.size} � Verified Indian Retail
                    </span>
                  </div>

                  <div className="p-3 rounded-xl glass-sub space-y-1">
                    <span className="font-semibold text-[#8C6D2B] block">Dermatological Rationale</span>
                    <p className="text-[#554A42] leading-relaxed">
                      {getReason(selectedModalProduct)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#554A42] block font-semibold">
                      Complete Bioactives
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedModalProduct.key_ingredients.map((ing, i) => (
                        <span key={i} className="glass-chip text-[10px]">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedModalProduct(null)}
                  className="px-4 py-2 rounded-full glass-btn text-xs"
                >
                  Close
                </button>
                <a
                  href={selectedModalProduct.product_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="px-6 py-2.5 rounded-full bg-[#2A2420] text-white text-xs font-medium hover:bg-[#3D352F] flex items-center gap-1.5"
                >
                  <span>Buy on {selectedModalProduct.store || 'Nykaa'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#E5CA8F]" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
