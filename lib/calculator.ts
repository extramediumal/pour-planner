import {
  CalculatorInputs,
  CalculatorResults,
} from './types';
import {
  INTENSITY_MODIFIERS,
  AGE_MODIFIERS,
  BAR_SPLITS,
  DRINK_UNITS,
  BASE_PRICES,
  QUALITY_MODIFIERS,
  SERVICE_MODIFIERS,
  VIBE_LEVELS,
  STATE_MULTIPLIERS,
} from './constants';

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const { guests, hours, barStyle, intensity, ageSkew, serviceType, qualityTier, state } = inputs;

  // Calculate drinks per person per hour
  const drinksPerHour = INTENSITY_MODIFIERS[intensity] * AGE_MODIFIERS[ageSkew];

  // Total drinks
  const totalDrinks = Math.round(guests * hours * drinksPerHour);

  // Split by bar style
  const splits = BAR_SPLITS[barStyle];
  const beerDrinks = Math.round(totalDrinks * splits.beer);
  const wineDrinks = Math.round(totalDrinks * splits.wine);
  const spiritDrinks = Math.round(totalDrinks * splits.spirits);

  // Convert to bottles/cases
  const beerBottles = beerDrinks;
  const beerCases = Math.ceil(beerBottles / DRINK_UNITS.beerPerCase);

  const wineBottles = Math.ceil(wineDrinks / DRINK_UNITS.wineGlassesPerBottle);
  const wineRed = Math.ceil(wineBottles * 0.6);
  const wineWhite = wineBottles - wineRed;

  const spiritBottles = Math.ceil(spiritDrinks / DRINK_UNITS.spiritShotsPerBottle);
  const spiritBreakdown = {
    vodka: Math.ceil(spiritBottles * 0.3),
    whiskey: Math.ceil(spiritBottles * 0.25),
    rum: Math.ceil(spiritBottles * 0.25),
    tequila: Math.ceil(spiritBottles * 0.2),
  };

  // Calculate cost
  const stateMultiplier = STATE_MULTIPLIERS[state] || 1.0;
  const qualityMultiplier = QUALITY_MODIFIERS[qualityTier];
  const serviceMultiplier = SERVICE_MODIFIERS[serviceType];

  const baseCost =
    beerBottles * BASE_PRICES.beerPerBottle +
    wineBottles * BASE_PRICES.winePerBottle +
    spiritBottles * BASE_PRICES.spiritPerBottle;

  const adjustedCost = baseCost * stateMultiplier * qualityMultiplier * serviceMultiplier;
  const costLow = Math.round(adjustedCost * 0.9);
  const costHigh = Math.round(adjustedCost * 1.1);

  // Determine vibe level
  const vibe = VIBE_LEVELS.find(
    v => drinksPerHour >= v.minDrinksPerHour && drinksPerHour < v.maxDrinksPerHour
  ) || VIBE_LEVELS[VIBE_LEVELS.length - 1];

  return {
    beerBottles,
    beerCases,
    wineBottles,
    wineRed,
    wineWhite,
    spiritBottles,
    spiritBreakdown,
    costLow,
    costHigh,
    vibeLevel: vibe.level,
    vibeName: vibe.name,
    vibeDescription: vibe.description,
  };
}
