export type BarStyle = 'beer' | 'beer-wine' | 'full';
export type Intensity = 'very-light' | 'light' | 'moderate' | 'heavy' | 'very-heavy';
export type AgeSkew = 'younger' | 'mixed' | 'older';
export type ServiceType = 'byob' | 'venue';
export type QualityTier = 'budget' | 'mid' | 'premium';

export interface CalculatorInputs {
  guests: number;
  hours: number;
  barStyle: BarStyle;
  intensity: Intensity;
  ageSkew: AgeSkew;
  serviceType: ServiceType;
  qualityTier: QualityTier;
  state: string;
}

export interface CalculatorResults {
  beerBottles: number;
  beerCases: number;
  wineBottles: number;
  wineRed: number;
  wineWhite: number;
  spiritBottles: number;
  spiritBreakdown: {
    vodka: number;
    whiskey: number;
    rum: number;
    tequila: number;
  };
  costLow: number;
  costHigh: number;
  vibeLevel: number;
  vibeName: string;
  vibeDescription: string;
}

export interface VibeLevel {
  level: number;
  name: string;
  description: string;
  minDrinksPerHour: number;
  maxDrinksPerHour: number;
}
