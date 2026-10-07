export type Page = 'home' | 'analyze' | 'results' | 'skin' | 'routine' | 'history' | 'about' | 'diet' | 'login' | 'products';

export type MetricStatus = 'optimal' | 'balanced' | 'moderate' | 'attention' | 'low';

export type DetectedCondition = 'acne' | 'eczema' | 'fungal_infection' | 'pigmentation' | 'dryness' | 'general_barrier';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export type ProductTier = 'affordable' | 'mid' | 'premium';
export type ProductCategory = 'cleanser' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price_inr: number;
  size: string;
  tier: ProductTier;
  key_ingredients: string[];
  suits_conditions: DetectedCondition[];
  skin_types: string[];
  image: string;
  product_url: string;
  price_checked_date: string;
  store?: string;
}

export interface SkinMetric {
  id: 'hydration' | 'oilBalance' | 'texture' | 'clarity' | 'redness' | 'pigmentation';
  name: string;
  score: number; // 0 - 100
  status: MetricStatus;
  displayValue: string; // "78%", "Balanced", "Low", etc.
  description: string;
  category: 'barrier' | 'tone' | 'texture';
  optimalRange?: string;
}

export interface SkinConcern {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'pronounced';
  description: string;
  area: string;
}

export interface RoutineStep {
  id: string;
  stepNumber: number;
  timeOfDay: 'morning' | 'evening' | 'both';
  category: 'Cleanser' | 'Treatment' | 'Moisturizer' | 'SPF' | 'Specialty';
  productName: string;
  subtitle: string;
  keyActives: string[];
  what: string;
  why: string;
  when: string;
  how: string;
  textureNote?: string;
}

export interface AnalysisResult {
  id: string;
  date: string;
  formattedDate: string;
  imageUrl: string;
  overallScore: number;
  skinType: 'Balanced' | 'Combination' | 'Dry' | 'Oily' | 'Sensitive';
  headline: string;
  summary: string;
  metrics: SkinMetric[];
  concerns: SkinConcern[];
  routine: RoutineStep[];
  disclaimer: string;
  detectedCondition?: DetectedCondition;
  confidence?: number;
  conditionLabel?: string;
}

export interface DietNutrient {
  name: string;
  benefit: string;
  sources: string;
}

export interface FoodItem {
  item: string;
  reason: string;
  category?: string;
}

export interface SampleMealPlan {
  breakfast: { veg: string; nonVeg: string };
  lunch: { veg: string; nonVeg: string };
  snack: { veg: string; nonVeg: string };
  dinner: { veg: string; nonVeg: string };
}

export interface DietRecommendation {
  conditionId: DetectedCondition;
  name: string;
  tagline: string;
  keyNutrients: DietNutrient[];
  foodsToEat: FoodItem[];
  foodsToLimit: FoodItem[];
  hydrationTip: string;
  sampleMealPlan: SampleMealPlan;
}

export interface DailyHabit {
  waterIntake: boolean;
  sunProtection: boolean;
  restfulSleep: boolean;
  eveningCleanse: boolean;
}

export interface JournalCheckIn {
  date: string;
  score: number;
  feeling: 'radiant' | 'balanced' | 'dry' | 'reactive';
  habits: DailyHabit;
  note: string;
}

