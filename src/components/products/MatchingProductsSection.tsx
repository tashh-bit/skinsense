import React from 'react';
import { Product, DetectedCondition, ProductCategory } from '../../types';
import productsData from '../../data/products.json';
import { ProductCard } from './ProductCard';
import { Badge } from '../ui/Badge';
import { EditorialButton } from '../ui/EditorialButton';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useSkinSense } from '../../context/SkinSenseContext';

interface MatchingProductsSectionProps {
  condition?: DetectedCondition;
  category?: ProductCategory;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export const MatchingProductsSection: React.FC<MatchingProductsSectionProps> = ({
  condition,
  category,
  title = 'Verified Clinical Formulations in India',
  subtitle = 'Targeted genuine products selected to match your detected dermal metrics.',
  limit = 4,
}) => {
  const { currentAnalysis, setCurrentPage } = useSkinSense();
  const activeCondition = condition || currentAnalysis.detectedCondition || 'dryness';

  // Filter matching products
  const allProducts = productsData as unknown as Product[];
  const matching = allProducts
    .filter((p) => {
      if (category && p.category !== category) return false;
      return (
        p.suits_conditions.includes(activeCondition) ||
        p.suits_conditions.includes('general_barrier')
      );
    })
    .slice(0, limit);

  if (matching.length === 0) return null;

  return (
    <div className="space-y-6 pt-6 border-t border-white/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="glass-warm" size="sm" className="gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-[#8C6D2B]" />
            <span className="font-mono text-xs">Retail Product Matching (INR)</span>
          </Badge>
          <h2 className="editorial-heading text-2xl sm:text-3xl font-light text-[#2A2420]">
            {title}
          </h2>
          <p className="font-sans text-xs text-[#554A42]">
            {subtitle}
          </p>
        </div>

        <EditorialButton
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage('products')}
          className="gap-2 glass-btn"
        >
          <span>Explore All 30+ Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </EditorialButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {matching.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            activeCondition={activeCondition}
          />
        ))}
      </div>
    </div>
  );
};
