import { describe, it, expect } from 'vitest';
import { calculate } from './calculator';
import { DEFAULTS } from './constants';

describe('calculate', () => {
  it('calculates correct beer quantities for beer-only bar', () => {
    const inputs = {
      ...DEFAULTS,
      guests: 100,
      hours: 4,
      barStyle: 'beer' as const,
      intensity: 'moderate' as const,
      ageSkew: 'mixed' as const,
    };

    const result = calculate(inputs);

    // 100 guests * 4 hours * 1.0 intensity * 1.0 age = 400 drinks
    // 400 drinks / 24 per case = 16.67 cases, rounded up = 17 cases
    expect(result.beerCases).toBe(17);
    expect(result.beerBottles).toBe(400);
    expect(result.wineBottles).toBe(0);
    expect(result.spiritBottles).toBe(0);
  });

  it('calculates correct vibe level for moderate drinking', () => {
    const inputs = {
      ...DEFAULTS,
      guests: 100,
      hours: 4,
      intensity: 'moderate' as const,
    };

    const result = calculate(inputs);

    // 1.0 drinks per hour = level 3 (range is 0.75 <= x <= 1.0)
    expect(result.vibeLevel).toBe(3);
    expect(result.vibeName).toBe('Social Sippers');
  });

  it('calculates correct vibe level for heavy drinking', () => {
    const inputs = {
      ...DEFAULTS,
      guests: 100,
      hours: 4,
      intensity: 'heavy' as const,
    };

    const result = calculate(inputs);

    // 1.5 drinks per hour = level 5
    expect(result.vibeLevel).toBe(5);
    expect(result.vibeName).toBe('Eternal Frat Boys');
  });

  it('applies state multiplier to cost', () => {
    const inputsTX = { ...DEFAULTS, state: 'TX' };
    const inputsWA = { ...DEFAULTS, state: 'WA' };

    const resultTX = calculate(inputsTX);
    const resultWA = calculate(inputsWA);

    // WA has higher tax (1.35) vs TX (1.05)
    expect(resultWA.costLow).toBeGreaterThan(resultTX.costLow);
  });

  it('splits drinks correctly for full bar', () => {
    const inputs = {
      ...DEFAULTS,
      barStyle: 'full' as const,
      guests: 100,
      hours: 4,
    };

    const result = calculate(inputs);

    // Total 400 drinks: 40% beer, 35% wine, 25% spirits
    expect(result.beerBottles).toBe(160);
    expect(result.wineBottles).toBe(28); // 140 glasses / 5 per bottle = 28
    expect(result.spiritBottles).toBe(7); // 100 shots / 16 per bottle = 6.25, rounded = 7
  });
});
