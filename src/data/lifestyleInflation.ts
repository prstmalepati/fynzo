/**
 * Luxury Inflation Database
 * Real-world inflation rates for high-end lifestyle items
 * Data sources: industry reports, historical pricing, market analysis
 */

export interface InflationCategory {
  name: string;
  avgInflationRate: number;
  description: string;
  emoji: string;
}

export interface LifestyleItemTemplate {
  id: string;
  name: string;
  category: string;
  typicalCost: number;
  currency: string;
  inflationRate: number;
  description: string;
  emoji: string;
  tags: string[];
}

// Historical luxury inflation rates (higher than CPI)
export const INFLATION_CATEGORIES: Record<string, InflationCategory> = {
  supercars: {
    name: 'Supercars & Luxury Vehicles',
    avgInflationRate: 0.06,  // 6% annual
    description: 'High-end vehicles (Porsche, Ferrari, etc.)',
    emoji: '🏎️'
  },
  privateSchool: {
    name: 'Private Education',
    avgInflationRate: 0.045,  // 4.5% annual
    description: 'Private schools and international education',
    emoji: '🏫'
  },
  luxuryRealEstate: {
    name: 'Luxury Real Estate',
    avgInflationRate: 0.055,  // 5.5% annual
    description: 'Prime location properties',
    emoji: '🏡'
  },
  healthcare: {
    name: 'Private Healthcare',
    avgInflationRate: 0.065,  // 6.5% annual
    description: 'Premium health insurance and treatments',
    emoji: '🏥'
  },
  travel: {
    name: 'Luxury Travel',
    avgInflationRate: 0.05,  // 5% annual
    description: 'Business/first class flights, 5-star hotels',
    emoji: '✈️'
  },
  watches: {
    name: 'Luxury Watches',
    avgInflationRate: 0.08,  // 8% annual
    description: 'High-end timepieces (Rolex, Patek Philippe)',
    emoji: '⌚'
  },
  yachts: {
    name: 'Yachts & Boats',
    avgInflationRate: 0.07,  // 7% annual
    description: 'Recreational watercraft',
    emoji: '🛥️'
  },
  art: {
    name: 'Fine Art & Collectibles',
    avgInflationRate: 0.09,  // 9% annual
    description: 'Paintings, sculptures, rare items',
    emoji: '🖼️'
  },
  jewelry: {
    name: 'Fine Jewelry',
    avgInflationRate: 0.055,  // 5.5% annual
    description: 'Diamonds, precious metals',
    emoji: '💎'
  },
  wine: {
    name: 'Fine Wine & Spirits',
    avgInflationRate: 0.075,  // 7.5% annual
    description: 'Premium wines and rare spirits',
    emoji: '🍷'
  }
};

// Pre-built lifestyle item templates
export const LIFESTYLE_TEMPLATES: LifestyleItemTemplate[] = [
  // Vehicles
  {
    id: 'porsche-911',
    name: 'Porsche 911 Turbo',
    category: 'supercars',
    typicalCost: 180000,
    currency: 'EUR',
    inflationRate: 0.06,
    description: 'Iconic sports car',
    emoji: '🏎️',
    tags: ['vehicle', 'luxury', 'sports car']
  },
  {
    id: 'ferrari-488',
    name: 'Ferrari 488',
    category: 'supercars',
    typicalCost: 250000,
    currency: 'EUR',
    inflationRate: 0.065,
    description: 'Italian supercar',
    emoji: '🏎️',
    tags: ['vehicle', 'exotic', 'investment']
  },
  {
    id: 'tesla-model-s',
    name: 'Tesla Model S Plaid',
    category: 'supercars',
    typicalCost: 120000,
    currency: 'EUR',
    inflationRate: 0.04,
    description: 'Electric luxury sedan',
    emoji: '⚡',
    tags: ['vehicle', 'electric', 'tech']
  },
  {
    id: 'range-rover',
    name: 'Range Rover Autobiography',
    category: 'supercars',
    typicalCost: 140000,
    currency: 'EUR',
    inflationRate: 0.055,
    description: 'Luxury SUV',
    emoji: '🚙',
    tags: ['vehicle', 'suv', 'family']
  },
  
  // Education
  {
    id: 'private-school-uk',
    name: 'UK Private School (per child)',
    category: 'privateSchool',
    typicalCost: 25000,
    currency: 'EUR',
    inflationRate: 0.045,
    description: 'Annual tuition and fees',
    emoji: '🏫',
    tags: ['education', 'recurring', 'children']
  },
  {
    id: 'international-school',
    name: 'International School (per child)',
    category: 'privateSchool',
    typicalCost: 30000,
    currency: 'EUR',
    inflationRate: 0.05,
    description: 'IB program annual tuition',
    emoji: '🌍',
    tags: ['education', 'recurring', 'international']
  },
  {
    id: 'ivy-league',
    name: 'US Ivy League University',
    category: 'privateSchool',
    typicalCost: 70000,
    currency: 'USD',
    inflationRate: 0.055,
    description: 'Annual tuition + room & board',
    emoji: '🎓',
    tags: ['education', 'university', 'usa']
  },
  
  // Real Estate
  {
    id: 'london-apartment',
    name: 'London Central Apartment',
    category: 'luxuryRealEstate',
    typicalCost: 1200000,
    currency: 'GBP',
    inflationRate: 0.055,
    description: '2-bed in Zone 1',
    emoji: '🏙️',
    tags: ['property', 'apartment', 'city']
  },
  {
    id: 'swiss-chalet',
    name: 'Swiss Alps Chalet',
    category: 'luxuryRealEstate',
    typicalCost: 800000,
    currency: 'EUR',
    inflationRate: 0.06,
    description: 'Luxury mountain property',
    emoji: '🏔️',
    tags: ['property', 'vacation', 'mountain']
  },
  {
    id: 'tuscan-villa',
    name: 'Tuscan Villa',
    category: 'luxuryRealEstate',
    typicalCost: 1500000,
    currency: 'EUR',
    inflationRate: 0.05,
    description: 'Italian countryside estate',
    emoji: '🏰',
    tags: ['property', 'villa', 'italy']
  },
  {
    id: 'miami-condo',
    name: 'Miami Beach Condo',
    category: 'luxuryRealEstate',
    typicalCost: 900000,
    currency: 'USD',
    inflationRate: 0.065,
    description: 'Oceanfront luxury condo',
    emoji: '🏖️',
    tags: ['property', 'beach', 'usa']
  },
  
  // Healthcare
  {
    id: 'private-health-insurance',
    name: 'Private Health Insurance (Family)',
    category: 'healthcare',
    typicalCost: 8000,
    currency: 'EUR',
    inflationRate: 0.065,
    description: 'Annual premium for family of 4',
    emoji: '🏥',
    tags: ['healthcare', 'recurring', 'insurance']
  },
  {
    id: 'concierge-medicine',
    name: 'Concierge Medicine Membership',
    category: 'healthcare',
    typicalCost: 15000,
    currency: 'USD',
    inflationRate: 0.07,
    description: '24/7 access to private doctor',
    emoji: '⚕️',
    tags: ['healthcare', 'recurring', 'premium']
  },
  
  // Travel
  {
    id: 'business-class-annual',
    name: 'Business Class Flights (Annual)',
    category: 'travel',
    typicalCost: 20000,
    currency: 'EUR',
    inflationRate: 0.05,
    description: '10 long-haul business class tickets',
    emoji: '✈️',
    tags: ['travel', 'recurring', 'flights']
  },
  {
    id: 'luxury-hotel-stays',
    name: '5-Star Hotel Stays (Annual)',
    category: 'travel',
    typicalCost: 15000,
    currency: 'EUR',
    inflationRate: 0.048,
    description: '30 nights at luxury hotels',
    emoji: '🏨',
    tags: ['travel', 'recurring', 'accommodation']
  },
  {
    id: 'private-jet-card',
    name: 'Private Jet Card (25 hours)',
    category: 'travel',
    typicalCost: 150000,
    currency: 'USD',
    inflationRate: 0.06,
    description: 'Prepaid private aviation',
    emoji: '🛩️',
    tags: ['travel', 'luxury', 'aviation']
  },
  
  // Luxury Goods
  {
    id: 'rolex-submariner',
    name: 'Rolex Submariner',
    category: 'watches',
    typicalCost: 12000,
    currency: 'EUR',
    inflationRate: 0.08,
    description: 'Classic dive watch',
    emoji: '⌚',
    tags: ['watch', 'investment', 'classic']
  },
  {
    id: 'patek-philippe',
    name: 'Patek Philippe Nautilus',
    category: 'watches',
    typicalCost: 45000,
    currency: 'EUR',
    inflationRate: 0.12,
    description: 'Iconic luxury sports watch',
    emoji: '⌚',
    tags: ['watch', 'investment', 'rare']
  },
  {
    id: 'hermes-birkin',
    name: 'Hermès Birkin Bag',
    category: 'jewelry',
    typicalCost: 15000,
    currency: 'EUR',
    inflationRate: 0.14,
    description: 'Iconic handbag (often appreciates)',
    emoji: '👜',
    tags: ['fashion', 'investment', 'luxury']
  },
  
  // Yachts & Boats
  {
    id: 'yacht-40ft',
    name: '40ft Luxury Yacht',
    category: 'yachts',
    typicalCost: 350000,
    currency: 'EUR',
    inflationRate: 0.07,
    description: 'Mid-size motor yacht',
    emoji: '🛥️',
    tags: ['yacht', 'recreation', 'maritime']
  },
  {
    id: 'superyacht-80ft',
    name: '80ft Superyacht',
    category: 'yachts',
    typicalCost: 2500000,
    currency: 'EUR',
    inflationRate: 0.075,
    description: 'Large luxury yacht with crew',
    emoji: '🛥️',
    tags: ['yacht', 'luxury', 'extreme']
  },
  
  // Art & Wine
  {
    id: 'contemporary-art',
    name: 'Contemporary Art Piece',
    category: 'art',
    typicalCost: 50000,
    currency: 'EUR',
    inflationRate: 0.09,
    description: 'Emerging artist painting',
    emoji: '🖼️',
    tags: ['art', 'investment', 'culture']
  },
  {
    id: 'wine-collection',
    name: 'Fine Wine Collection (Annual)',
    category: 'wine',
    typicalCost: 10000,
    currency: 'EUR',
    inflationRate: 0.075,
    description: 'Premium wines for cellar',
    emoji: '🍷',
    tags: ['wine', 'recurring', 'investment']
  }
];

// Helper function to get items by category
export function getItemsByCategory(category: string): LifestyleItemTemplate[] {
  return LIFESTYLE_TEMPLATES.filter(item => item.category === category);
}

// Helper function to get category details
export function getCategoryInfo(category: string): InflationCategory {
  return INFLATION_CATEGORIES[category];
}

// Calculate future cost
export function calculateFutureCost(
  currentCost: number,
  inflationRate: number,
  years: number
): number {
  return currentCost * Math.pow(1 + inflationRate, years);
}

// Calculate required monthly savings
export function calculateMonthlySavings(
  currentCost: number,
  futureCost: number,
  years: number
): number {
  const totalGap = futureCost - currentCost;
  return totalGap / (years * 12);
}
