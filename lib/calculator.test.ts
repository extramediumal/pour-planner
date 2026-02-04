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

    // 100 guests * 4 hours * 0.85 intensity * 1.0 age = 340 drinks
    // 340 drinks / 24 per case = 14.17 cases, rounded up = 15 cases
    expect(result.beerCases).toBe(15);
    expect(result.beerBottles).toBe(340);
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

    // 0.85 drinks per hour = level 3 (range is 0.7 <= x < 1.0)
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

    // 1.25 drinks per hour = level 4
    expect(result.vibeLevel).toBe(4);
    expect(result.vibeName).toBe("We're Here to Party");
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

    // Total 340 drinks (100 * 4 * 0.85): 40% beer, 35% wine, 25% spirits
    // Beer: 340 * 0.4 = 136
    // Wine: 340 * 0.35 = 119 glasses / 5 = 24 bottles
    // Spirits: 340 * 0.25 = 85 shots / 16 = 6 bottles
    expect(result.beerBottles).toBe(136);
    expect(result.wineBottles).toBe(24);
    expect(result.spiritBottles).toBe(6);
  });
});
