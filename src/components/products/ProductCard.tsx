import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product, DetectedCondition } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Heart, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSkinSense } from '../../context/SkinSenseContext';

interface ProductCardProps {
  product: Product;
  activeCondition?: DetectedCondition;
  onClickDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, activeCondition, onClickDetail }) => {
  const { wishlist, toggleWishlist } = useSkinSense();
  const [imgError, setImgError] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  // Formatter for Indian Rupee currency with Indian digit grouping (e.g. ?1,299)
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getTierBadge = () => {
    if (product.tier === 'affordable') {
      return (
        <span className="glass-chip text-[10px] font-mono text-[#3D5440] bg-[#E8F0EA]/70 border-[#C5D8C9]">
          Affordable
        </span>
      );
    }
    if (product.tier === 'mid') {
      return (
        <span className="glass-chip text-[10px] font-mono text-[#8C6D2B] bg-[#FAF5EB]/70 border-[#ECDDC3]">
          Mid-Tier
        </span>
      );
    }
    return (
      <span className="glass-chip text-[10px] font-mono text-[#432E63] bg-[#F2EDF8]/70 border-[#D8CDE8]">
        Luxury Clinical
      </span>
    );
  };

  const getReasonForCondition = (): string => {
    const cond = activeCondition || 'general_barrier';
    if (cond === 'acne') {
      return `Non-comedogenic formulation targeting follicular congestion without stripping barrier lipids.`;
    }
    if (cond === 'eczema') {
      return `Contains barrier-restorative lipids that soothe acute pruritus and lower TEWL.`;
    }
    if (cond === 'fungal_infection') {
      return `Free of fatty acids that feed Malassezia yeasts; pH-balanced for skin microbiome harmony.`;
    }
    if (cond === 'pigmentation') {
      return `Features tyrosinase-inhibiting actives that fade localized post-inflammatory hyperpigmentation.`;
    }
    if (cond === 'dryness') {
      return `Deeply rehydrates trans-epidermal moisture reservoirs with biomimetic humectants and ceramides.`;
    }
    return `Reinforces daily acid mantle integrity and defends against urban environmental oxidative stress.`;
  };

  const altText = `${product.brand} ${product.name} ${product.size}`;

  return (
    <GlassCard
      variant="glass"
      hoverEffect
      tiltEffect
      className="p-5 rounded-3xl flex flex-col justify-between h-full group relative transition-all duration-300 border-white/80 shadow-soft cursor-pointer"
      onClick={() => onClickDetail?.(product)}
    >
      <div>
        {/* Top Badges & Wishlist Heart */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {getTierBadge()}
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#554A42] bg-white/40 px-2 py-0.5 rounded-full border border-white/60">
              {product.category}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full transition-all ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'glass-sub text-[#554A42] hover:text-[#2A2420]'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Image Frame (Cut-out with Soft Contact Shadow or Glass Placeholder) */}
        <div className="relative mx-auto w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/30 border border-white/60 mb-4 p-2 flex items-center justify-center">
          {!imgError ? (
            <img
              src={product.image}
              alt={altText}
              className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Elegant Glass Placeholder when image is missing/offline */
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 glass-sub rounded-xl space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8C6D2B]">Official Packshot</span>
              <span className="font-serif text-sm font-semibold text-[#2A2420]">{product.brand}</span>
              <span className="font-sans text-[11px] text-[#554A42] line-clamp-1">{product.name}</span>
            </div>
          )}

          {/* Glass Brand Badge overlay */}
          <div className="absolute bottom-2.5 left-2.5 glass-chip text-[10px] font-mono font-medium text-[#2A2420] shadow-sm">
            {product.brand}
          </div>
          <div className="absolute top-2.5 right-2.5 text-[10px] font-mono text-[#554A42] bg-white/80 px-2 py-0.5 rounded-full border border-white/60 shadow-xs">
            {product.size}
          </div>
        </div>

        {/* Product Title & Brand */}
        <div className="space-y-1 mb-3">
          <h3 className="font-serif text-lg font-light text-[#2A2420] group-hover:text-[#5B3E84] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="font-sans text-xs text-[#554A42] line-clamp-2 leading-relaxed">
            {getReasonForCondition()}
          </p>
        </div>

        {/* Key Actives Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.key_ingredients.slice(0, 3).map((ing, i) => (
            <span
              key={i}
              className="text-[10px] font-mono text-[#2A2420] bg-white/60 border border-white/80 px-2 py-0.5 rounded-full"
            >
              {ing}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: INR Price & Purchase Action */}
      <div className="pt-3 border-t border-white/60 flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="font-mono text-base font-semibold text-[#2A2420] tracking-tight block">
            {formatINR(product.price_inr)}
          </span>
          <span className="font-mono text-[9px] text-[#554A42] block">
            Price as of {product.price_checked_date}, may vary
          </span>
        </div>

        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={(e) => e.stopPropagation()}
          className="glass-btn px-3.5 py-1.5 text-xs font-sans font-medium text-[#2A2420] hover:bg-[#2A2420] hover:text-white transition-all flex items-center gap-1 shrink-0"
        >
          <span>Buy on {product.store || 'Store'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </GlassCard>
  );
};
