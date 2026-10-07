import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinSense } from '../context/SkinSenseContext';
import { Product, ProductCategory, ProductTier, DetectedCondition } from '../types';
import productsData from '../data/products.json';
import { ProductCard } from '../components/products/ProductCard';
import { ProductShowcaseSlider } from '../components/products/ProductShowcaseSlider';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { EditorialButton } from '../components/ui/EditorialButton';
import { MagneticPill } from '../components/motion/MagneticPill';
import {
  ShoppingBag,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Layers,
  Heart,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Grid3X3,
  Film,
  X,
} from 'lucide-react';

const CONDITIONS_LIST: { id: DetectedCondition | 'all'; label: string }[] = [
  { id: 'all', label: 'All Conditions' },
  { id: 'acne', label: 'Acne & Breakouts' },
  { id: 'eczema', label: 'Eczema & Sensitivity' },
  { id: 'fungal_infection', label: 'Fungal / Malassezia' },
  { id: 'pigmentation', label: 'Hyperpigmentation' },
  { id: 'dryness', label: 'Dryness & Dehydration' },
  { id: 'general_barrier', label: 'Barrier Equilibrium' },
];

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'cleanser', label: 'Cleansers' },
  { id: 'serum', label: 'Serums' },
  { id: 'moisturizer', label: 'Moisturizers' },
  { id: 'sunscreen', label: 'Sunscreens' },
  { id: 'treatment', label: 'Treatments' },
];

const TIERS: { id: ProductTier | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tiers' },
  { id: 'affordable', label: 'Affordable (Under ?1,000)' },
  { id: 'mid', label: 'Mid-Range (?1,000 - ?2,500)' },
  { id: 'premium', label: 'Luxury Clinical (?2,500+)' },
];

export const Products: React.FC = () => {
  const { currentAnalysis, wishlist, setCurrentPage } = useSkinSense();

  const detectedCond = currentAnalysis.detectedCondition || 'dryness';

  // View state: 'slider' | 'grid'
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<DetectedCondition | 'all'>(detectedCond);
  const [selectedTier, setSelectedTier] = useState<ProductTier | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(8000);
  const [sortBy, setSortBy] = useState<'match' | 'low-high' | 'high-low'>('match');
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);

  // "Build My Routine" Modal
  const [showRoutineBuilder, setShowRoutineBuilder] = useState<boolean>(false);

  // Detail Modal State (for grid view item click)
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  const allProducts = productsData as unknown as Product[];

  const brands = useMemo(() => {
    const list = Array.from(new Set(allProducts.map((p) => p.brand))).sort();
    return ['all', ...list];
  }, [allProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (onlyWishlist && !wishlist.includes(p.id)) return false;
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedTier !== 'all' && p.tier !== selectedTier) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (p.price_inr > maxBudget) return false;
        if (
          selectedCondition !== 'all' &&
          !p.suits_conditions.includes(selectedCondition as DetectedCondition) &&
          !p.suits_conditions.includes('general_barrier')
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return a.price_inr - b.price_inr;
        if (sortBy === 'high-low') return b.price_inr - a.price_inr;
        const aMatch = selectedCondition !== 'all' && a.suits_conditions.includes(selectedCondition as DetectedCondition);
        const bMatch = selectedCondition !== 'all' && b.suits_conditions.includes(selectedCondition as DetectedCondition);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return a.price_inr - b.price_inr;
      });
  }, [allProducts, selectedCategory, selectedCondition, selectedTier, selectedBrand, maxBudget, sortBy, onlyWishlist, wishlist]);

  // "Build My Routine" algorithm
  const builtRoutine = useMemo(() => {
    const active = (selectedCondition === 'all' ? detectedCond : selectedCondition) as DetectedCondition;

    const getBestFor = (cat: ProductCategory) => {
      const candidates = allProducts.filter(
        (p) =>
          p.category === cat &&
          (p.suits_conditions.includes(active) || p.suits_conditions.includes('general_barrier'))
      );
      if (candidates.length === 0) return allProducts.find((p) => p.category === cat) || allProducts[0];
      if (selectedTier !== 'all') {
        const tierMatch = candidates.find((c) => c.tier === selectedTier);
        if (tierMatch) return tierMatch;
      }
      return candidates.sort((a, b) => a.price_inr - b.price_inr)[0];
    };

    const cleanser = getBestFor('cleanser');
    const treatment = getBestFor('treatment') || getBestFor('serum');
    const moisturizer = getBestFor('moisturizer');
    const sunscreen = getBestFor('sunscreen');

    const totalINR = cleanser.price_inr + treatment.price_inr + moisturizer.price_inr + sunscreen.price_inr;

    return {
      cleanser,
      treatment,
      moisturizer,
      sunscreen,
      totalINR,
    };
  }, [selectedCondition, detectedCond, selectedTier, allProducts]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedTier('all');
    setSelectedBrand('all');
    setMaxBudget(8000);
    setSortBy('match');
    setOnlyWishlist(false);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const dynamicCollectionTitle = useMemo(() => {
    if (selectedCondition === 'acne') return 'Acne Care Edit 2026';
    if (selectedCondition === 'eczema') return 'Barrier & Sensitivity Edit 2026';
    if (selectedCondition === 'pigmentation') return 'Even Radiance & Melanin Edit 2026';
    if (selectedCondition === 'dryness') return 'Deep Hydration & Lipid Edit 2026';
    if (selectedCategory === 'sunscreen') return 'Photoprotection & Mineral Edit 2026';
    if (selectedCategory === 'serum') return 'Targeted Bioactive Serum Edit 2026';
    return 'Dermatological Edit 2026';
  }, [selectedCondition, selectedCategory]);

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-transparent text-[#2A2420]">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================= PAGE HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/60">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="glass-warm" size="sm" className="gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#8C6D2B]" />
                <span className="font-mono text-xs">Curated Indian Retail Apothecary</span>
              </Badge>
              <span className="glass-chip text-xs font-mono text-[#554A42]">
                INR Pricing � Verified Authenticity
              </span>
            </div>

            <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
              Prescribed Formulations.
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#554A42] max-w-2xl leading-relaxed">
              Every formulation is genuine, officially sold in India, and matched to your optical skin analysis. Prices verified as of <strong>October 2026</strong>.
            </p>
          </div>

          {/* Action Buttons: Build Routine & View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-full glass-strong">
              <button
                onClick={() => setViewMode('slider')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  viewMode === 'slider'
                    ? 'bg-[#2A2420] text-white shadow-sm'
                    : 'text-[#554A42] hover:text-[#2A2420]'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Showcase Reel</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#2A2420] text-white shadow-sm'
                    : 'text-[#554A42] hover:text-[#2A2420]'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>Directory</span>
              </button>
            </div>

            <MagneticPill strength={0.3}>
              <EditorialButton
                variant="primary"
                size="md"
                onClick={() => setShowRoutineBuilder(true)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#E5CA8F]" />
                <span>Build My Complete Routine</span>
              </EditorialButton>
            </MagneticPill>

            <button
              type="button"
              onClick={() => setOnlyWishlist(!onlyWishlist)}
              className={`p-3 rounded-full border transition-all ${
                onlyWishlist
                  ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                  : 'glass-btn text-[#554A42]'
              }`}
              title="Filter saved wishlist items"
              aria-label="Filter wishlist"
            >
              <Heart className={`w-4 h-4 ${onlyWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* ================= SECTION 6 SIGNATURE SHOWCASE SLIDER ================= */}
        {viewMode === 'slider' && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <ProductShowcaseSlider
              products={filteredProducts}
              activeCondition={selectedCondition === 'all' ? detectedCond : selectedCondition}
              collectionTitle={dynamicCollectionTitle}
            />
          </motion.div>
        )}

        {/* ================= FILTER TOOLBAR ================= */}
        <GlassCard variant="glass" className="p-6 md:p-8 rounded-[2.5rem] space-y-6">
          
          {/* Row 1: Category Chips */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#554A42] block">
              Filter by Product Category
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-sans px-3.5 py-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                    selectedCategory === cat.id
                      ? 'bg-[#2A2420] text-white shadow-soft scale-105'
                      : 'glass-chip hover:bg-white/50 text-[#554A42]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Condition / Concern Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#554A42]">
                Targeted Skin Condition
              </span>
              {selectedCondition === detectedCond && (
                <span className="font-mono text-[10px] text-[#3D5440] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Matched to your AI Scan
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {CONDITIONS_LIST.map((cond) => {
                const isSelected = selectedCondition === cond.id;
                const isMatched = detectedCond === cond.id;
                return (
                  <button
                    key={cond.id}
                    onClick={() => setSelectedCondition(cond.id)}
                    className={`text-xs font-sans px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 focus:outline-none ${
                      isSelected
                        ? 'bg-[#8C6D2B] text-white shadow-soft scale-105'
                        : 'glass-chip hover:bg-white/50 text-[#554A42]'
                    }`}
                  >
                    {isMatched && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#3D5440]'}`} />
                    )}
                    <span>{cond.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Tier, Brand, Budget Slider & Sort Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t border-white/60">
            
            {/* Price Tier */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#554A42] uppercase tracking-wider">
                Price Tier
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as ProductTier | 'all')}
                className="w-full py-2 px-3 rounded-2xl glass-sub text-xs text-[#2A2420] border border-white/80 focus:outline-none cursor-pointer"
              >
                {TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#554A42] uppercase tracking-wider">
                Brand Filter
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-2 px-3 rounded-2xl glass-sub text-xs text-[#2A2420] border border-white/80 focus:outline-none cursor-pointer capitalize"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'All Brands' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#554A42] uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full py-2 px-3 rounded-2xl glass-sub text-xs text-[#2A2420] border border-white/80 focus:outline-none cursor-pointer"
              >
                <option value="match">Dermatological Condition Match</option>
                <option value="low-high">Price: Low to High (INR)</option>
                <option value="high-low">Price: High to Low (INR)</option>
              </select>
            </div>

            {/* Budget Slider in INR */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#554A42]">
                <span>Max Budget:</span>
                <strong className="text-[#2A2420] font-sans text-xs">
                  {formatINR(maxBudget)}
                </strong>
              </div>
              <input
                type="range"
                min={300}
                max={8000}
                step={100}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-[#2A2420] cursor-pointer"
              />
            </div>

          </div>

          {/* Filter Status Summary & Reset */}
          <div className="flex items-center justify-between text-xs text-[#554A42] pt-2">
            <span>
              Showing <strong className="text-[#2A2420]">{filteredProducts.length}</strong> verified product{filteredProducts.length === 1 ? '' : 's'}
            </span>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-[#8C6D2B] hover:text-[#2A2420] font-mono text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </GlassCard>

        {/* ================= PRODUCTS DIRECTORY GRID ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-light text-[#2A2420]">
              Full Formulations Catalogue
            </h3>
            <span className="font-mono text-xs text-[#554A42]">
              {filteredProducts.length} Items
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <GlassCard variant="glass" className="p-12 text-center rounded-[2.5rem] space-y-4 max-w-md mx-auto">
              <ShoppingBag className="w-10 h-10 text-[#8C6D2B] mx-auto opacity-60" />
              <h3 className="font-serif text-2xl text-[#2A2420]">No matching products</h3>
              <p className="text-xs text-[#554A42]">
                Try raising your budget limit or resetting your category and brand filters.
              </p>
              <EditorialButton variant="secondary" size="sm" onClick={resetFilters}>
                Reset Filters
              </EditorialButton>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  activeCondition={selectedCondition === 'all' ? detectedCond : selectedCondition}
                  onClickDetail={(p) => setSelectedDetailProduct(p)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= MANDATORY ADVISORY NOTE ================= */}
        <div className="p-6 rounded-3xl glass-sub border border-white/80 space-y-2">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#8C6D2B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8C6D2B] font-semibold block">
                Formulation Guidance & Advisory Note
              </span>
              <p className="font-sans text-xs text-[#554A42] leading-relaxed">
                Product suggestions are general wellness recommendations, not medical advice. Always patch-test new products on your forearm 24 hours before facial application. Prices checked as of October 2026 and may fluctuate across retailers.
              </p>
            </div>
          </div>
        </div>

        {/* ================= "BUILD MY ROUTINE" MODAL ================= */}
        <AnimatePresence>
          {showRoutineBuilder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="glass-strong rounded-[32px] p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/90 space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/60">
                  <div className="space-y-1">
                    <Badge variant="glass-warm" size="sm">
                      Automated Synergistic Regimen
                    </Badge>
                    <h2 className="editorial-heading text-2xl sm:text-3xl text-[#2A2420]">
                      Your 4-Step Curated Regimen
                    </h2>
                    <p className="text-xs text-[#554A42]">
                      Targeted for {selectedCondition === 'all' ? detectedCond : selectedCondition} within your chosen budget parameters.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRoutineBuilder(false)}
                    className="p-2 rounded-full hover:bg-white/40 text-[#554A42]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 4 Chosen Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Step 1 � Cleanser', item: builtRoutine.cleanser },
                    { label: 'Step 2 � Treatment', item: builtRoutine.treatment },
                    { label: 'Step 3 � Moisturizer', item: builtRoutine.moisturizer },
                    { label: 'Step 4 � Sunscreen', item: builtRoutine.sunscreen },
                  ].map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl glass-sub space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C6D2B] font-semibold">
                          {step.label}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-[#2A2420] line-clamp-1">
                          {step.item.name}
                        </h4>
                        <span className="text-[11px] font-sans text-[#554A42] block">
                          Brand: {step.item.brand} ({step.item.size})
                        </span>
                      </div>

                      <div className="pt-2 border-t border-white/60 flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-[#2A2420]">
                          {formatINR(step.item.price_inr)}
                        </span>
                        <a
                          href={step.item.product_url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="text-[11px] font-medium text-[#8C6D2B] hover:underline flex items-center gap-1"
                        >
                          <span>Buy</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Cost & Action */}
                <div className="p-4 rounded-2xl glass-sub flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/80">
                  <div>
                    <span className="text-xs text-[#554A42] block">
                      Total 4-Step Regimen Cost (INR)
                    </span>
                    <span className="font-mono text-2xl font-bold text-[#2A2420]">
                      {formatINR(builtRoutine.totalINR)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRoutineBuilder(false)}
                      className="px-4 py-2 rounded-full glass-btn text-xs"
                    >
                      Close
                    </button>
                    <EditorialButton
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setShowRoutineBuilder(false);
                        setCurrentPage('routine');
                      }}
                    >
                      View in Routine Regimen ?
                    </EditorialButton>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ================= DETAIL MODAL (FROM DIRECTORY CLICK) ================= */}
        <AnimatePresence>
          {selectedDetailProduct && (
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
                      {selectedDetailProduct.brand} � {selectedDetailProduct.category}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-[#2A2420]">
                      {selectedDetailProduct.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDetailProduct(null)}
                    className="p-2 rounded-full hover:bg-white/40 text-[#2A2420]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-44 h-56 rounded-2xl bg-white/40 p-4 border border-white/80 shrink-0 flex items-center justify-center">
                    <img
                      src={selectedDetailProduct.image}
                      alt={`${selectedDetailProduct.brand} ${selectedDetailProduct.name} ${selectedDetailProduct.size}`}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  <div className="space-y-3 flex-1 text-xs text-[#2A2420]">
                    <div>
                      <span className="font-mono text-xl font-bold text-[#2A2420]">
                        {formatINR(selectedDetailProduct.price_inr)}
                      </span>
                      <span className="font-mono text-[10px] text-[#554A42] block">
                        Size: {selectedDetailProduct.size} � Verified Indian Retail
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#554A42] block font-semibold">
                        Complete Bioactives
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDetailProduct.key_ingredients.map((ing, i) => (
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
                    onClick={() => setSelectedDetailProduct(null)}
                    className="px-4 py-2 rounded-full glass-btn text-xs"
                  >
                    Close
                  </button>
                  <a
                    href={selectedDetailProduct.product_url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="px-6 py-2.5 rounded-full bg-[#2A2420] text-white text-xs font-medium hover:bg-[#3D352F] flex items-center gap-1.5"
                  >
                    <span>Buy on {selectedDetailProduct.store || 'Store'}</span>
                    <ExternalLink className="w-3 h-3 text-[#E5CA8F]" />
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
