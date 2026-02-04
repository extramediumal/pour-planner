import { VibeLevel } from './types';

export const DEFAULTS = {
  guests: 100,
  hours: 4,
  barStyle: 'beer-wine' as const,
  intensity: 'moderate' as const,
  ageSkew: 'mixed' as const,
  serviceType: 'byob' as const,
  qualityTier: 'mid' as const,
  state: 'TX',
};

export const INTENSITY_MODIFIERS = {
  'very-light': 0.4,
  light: 0.6,
  moderate: 0.85,
  heavy: 1.25,
  'very-heavy': 1.75,
};

export const AGE_MODIFIERS = {
  younger: 1.15,
  mixed: 1.0,
  older: 0.85,
};

export const BAR_SPLITS = {
  beer: { beer: 1.0, wine: 0, spirits: 0 },
  'beer-wine': { beer: 0.6, wine: 0.4, spirits: 0 },
  full: { beer: 0.4, wine: 0.35, spirits: 0.25 },
};

export const DRINK_UNITS = {
  beerPerCase: 24,
  wineGlassesPerBottle: 5,
  spiritShotsPerBottle: 16,
};

export const BASE_PRICES = {
  beerPerBottle: 1.25,
  winePerBottle: 12,
  spiritPerBottle: 25,
};

export const QUALITY_MODIFIERS = {
  budget: 0.6,
  mid: 1.0,
  premium: 1.8,
};

export const SERVICE_MODIFIERS = {
  byob: 1.0,
  venue: 3.0,
};

export const VIBE_LEVELS: VibeLevel[] = [
  { level: 1, name: 'Stone Cold Sober Squad', description: 'Minimal alcohol presence', minDrinksPerHour: 0, maxDrinksPerHour: 0.5 },
  { level: 2, name: '"I\'ll Have ONE Beer"', description: 'Light, controlled sipping', minDrinksPerHour: 0.5, maxDrinksPerHour: 0.7 },
  { level: 3, name: 'Social Sippers', description: 'Moderate, dinner-party vibes', minDrinksPerHour: 0.7, maxDrinksPerHour: 1.0 },
  { level: 4, name: 'We\'re Here to Party', description: 'Generous pours, good time', minDrinksPerHour: 1.0, maxDrinksPerHour: 1.5 },
  { level: 5, name: 'Eternal Frat Boys', description: 'Hold onto your hats', minDrinksPerHour: 1.5, maxDrinksPerHour: Infinity },
];

export const STATE_MULTIPLIERS: Record<string, number> = {
  AL: 1.15, AK: 1.10, AZ: 1.05, AR: 1.10, CA: 1.15,
  CO: 1.05, CT: 1.20, DE: 1.10, FL: 1.05, GA: 1.10,
  HI: 1.25, ID: 1.05, IL: 1.15, IN: 1.10, IA: 1.05,
  KS: 1.10, KY: 1.10, LA: 1.10, ME: 1.15, MD: 1.15,
  MA: 1.15, MI: 1.10, MN: 1.10, MS: 1.10, MO: 1.05,
  MT: 1.05, NE: 1.05, NV: 1.10, NH: 1.00, NJ: 1.15,
  NM: 1.10, NY: 1.20, NC: 1.15, ND: 1.05, OH: 1.10,
  OK: 1.10, OR: 1.10, PA: 1.20, RI: 1.15, SC: 1.10,
  SD: 1.05, TN: 1.15, TX: 1.05, UT: 1.20, VT: 1.10,
  VA: 1.15, WA: 1.35, WV: 1.10, WI: 1.05, WY: 1.02,
  DC: 1.20,
};

export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'Washington DC',
};
