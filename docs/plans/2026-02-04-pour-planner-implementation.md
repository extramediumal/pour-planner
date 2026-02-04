# Pour Planner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a clean, slider-based alcohol quantity calculator for weddings and events with real-time results, vibe meter, and sharing.

**Architecture:** Single-page Next.js app with client-side state. Inputs on left, results on right (stacked on mobile). All state encoded in URL params for sharing. No database needed.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, react-simple-maps, html-to-image

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

**Step 1: Initialize Next.js project**

Run (from worktree directory):
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

When prompted, accept defaults.

**Step 2: Verify project runs**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000, default Next.js page loads.

**Step 3: Clean up default page**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <h1 className="text-2xl font-semibold text-stone-800 p-8">Pour Planner</h1>
    </main>
  );
}
```

**Step 4: Update globals.css**

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --accent: #b45309;
  --accent-light: #fef3c7;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

**Step 5: Update layout with Inter font**

Update `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pour Planner - Wedding Alcohol Calculator",
  description: "Smart alcohol quantity estimator for weddings and events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 6: Verify changes**

Run: `npm run dev`
Expected: Page shows "Pour Planner" heading with off-white background.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with Tailwind"
```

---

## Task 2: Calculator Types and Constants

**Files:**
- Create: `lib/types.ts`
- Create: `lib/constants.ts`

**Step 1: Create types file**

Create `lib/types.ts`:

```typescript
export type BarStyle = 'beer' | 'beer-wine' | 'full';
export type Intensity = 'light' | 'moderate' | 'heavy';
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
```

**Step 2: Create constants file**

Create `lib/constants.ts`:

```typescript
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
  light: 0.75,
  moderate: 1.0,
  heavy: 1.5,
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
  { level: 2, name: '"I\'ll Have ONE Beer"', description: 'Light, controlled sipping', minDrinksPerHour: 0.5, maxDrinksPerHour: 0.75 },
  { level: 3, name: 'Social Sippers', description: 'Moderate, dinner-party vibes', minDrinksPerHour: 0.75, maxDrinksPerHour: 1.0 },
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
```

**Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build completes without errors.

**Step 4: Commit**

```bash
git add lib/types.ts lib/constants.ts
git commit -m "feat: add calculator types and constants"
```

---

## Task 3: Calculation Logic

**Files:**
- Create: `lib/calculator.ts`
- Create: `lib/calculator.test.ts`

**Step 1: Install testing dependencies**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Step 2: Add vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': '.',
    },
  },
});
```

**Step 3: Add test script to package.json**

Add to `package.json` scripts:
```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 4: Write failing test**

Create `lib/calculator.test.ts`:

```typescript
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

    // 1.0 drinks per hour = level 3
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
```

**Step 5: Run test to verify it fails**

Run: `npm run test:run`
Expected: FAIL - module './calculator' not found

**Step 6: Implement calculator**

Create `lib/calculator.ts`:

```typescript
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
```

**Step 7: Run tests to verify they pass**

Run: `npm run test:run`
Expected: All tests pass.

**Step 8: Commit**

```bash
git add lib/calculator.ts lib/calculator.test.ts vitest.config.ts package.json package-lock.json
git commit -m "feat: implement calculation logic with tests"
```

---

## Task 4: Calculator State Hook

**Files:**
- Create: `hooks/useCalculator.ts`

**Step 1: Create the hook**

Create `hooks/useCalculator.ts`:

```typescript
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CalculatorInputs, CalculatorResults } from '@/lib/types';
import { DEFAULTS } from '@/lib/constants';
import { calculate } from '@/lib/calculator';

function parseSearchParams(searchParams: URLSearchParams): Partial<CalculatorInputs> {
  const params: Partial<CalculatorInputs> = {};

  const guests = searchParams.get('guests');
  if (guests) params.guests = parseInt(guests, 10);

  const hours = searchParams.get('hours');
  if (hours) params.hours = parseInt(hours, 10);

  const barStyle = searchParams.get('style');
  if (barStyle && ['beer', 'beer-wine', 'full'].includes(barStyle)) {
    params.barStyle = barStyle as CalculatorInputs['barStyle'];
  }

  const intensity = searchParams.get('intensity');
  if (intensity && ['light', 'moderate', 'heavy'].includes(intensity)) {
    params.intensity = intensity as CalculatorInputs['intensity'];
  }

  const ageSkew = searchParams.get('age');
  if (ageSkew && ['younger', 'mixed', 'older'].includes(ageSkew)) {
    params.ageSkew = ageSkew as CalculatorInputs['ageSkew'];
  }

  const serviceType = searchParams.get('service');
  if (serviceType && ['byob', 'venue'].includes(serviceType)) {
    params.serviceType = serviceType as CalculatorInputs['serviceType'];
  }

  const qualityTier = searchParams.get('quality');
  if (qualityTier && ['budget', 'mid', 'premium'].includes(qualityTier)) {
    params.qualityTier = qualityTier as CalculatorInputs['qualityTier'];
  }

  const state = searchParams.get('state');
  if (state) params.state = state;

  return params;
}

function buildSearchParams(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();
  params.set('guests', inputs.guests.toString());
  params.set('hours', inputs.hours.toString());
  params.set('style', inputs.barStyle);
  params.set('intensity', inputs.intensity);
  params.set('age', inputs.ageSkew);
  params.set('service', inputs.serviceType);
  params.set('quality', inputs.qualityTier);
  params.set('state', inputs.state);
  return params.toString();
}

export function useCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputs, setInputs] = useState<CalculatorInputs>(() => ({
    ...DEFAULTS,
    ...parseSearchParams(searchParams),
  }));

  const results: CalculatorResults = useMemo(() => calculate(inputs), [inputs]);

  const updateInput = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Sync URL with state (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = buildSearchParams(inputs);
      router.replace(`?${newParams}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timeout);
  }, [inputs, router]);

  const getShareUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}?${buildSearchParams(inputs)}`;
  };

  return {
    inputs,
    results,
    updateInput,
    getShareUrl,
  };
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build completes (may have warnings about unused exports, that's OK).

**Step 3: Commit**

```bash
git add hooks/useCalculator.ts
git commit -m "feat: add useCalculator hook with URL sync"
```

---

## Task 5: Slider Component

**Files:**
- Create: `components/Slider.tsx`

**Step 1: Create slider component**

Create `components/Slider.tsx`:

```tsx
'use client';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-stone-600">{label}</label>
        <span className="text-lg font-semibold text-stone-800">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:bg-amber-600
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:transition-transform
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:bg-amber-600
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-xs text-stone-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build completes without errors.

**Step 3: Commit**

```bash
git add components/Slider.tsx
git commit -m "feat: add Slider component"
```

---

## Task 6: Selector Components

**Files:**
- Create: `components/SegmentedControl.tsx`
- Create: `components/ToggleGroup.tsx`

**Step 1: Create SegmentedControl**

Create `components/SegmentedControl.tsx`:

```tsx
'use client';

interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-600">{label}</label>
      <div className="flex bg-stone-200 rounded-lg p-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all
              ${value === option.value
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {options.find(o => o.value === value)?.description && (
        <p className="text-xs text-stone-500">
          {options.find(o => o.value === value)?.description}
        </p>
      )}
    </div>
  );
}
```

**Step 2: Create ToggleGroup**

Create `components/ToggleGroup.tsx`:

```tsx
'use client';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface ToggleGroupProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-600">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`py-2 px-4 text-sm font-medium rounded-lg border transition-all
              ${value === option.value
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-stone-600 border-stone-300 hover:border-amber-600'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Verify components compile**

Run: `npm run build`
Expected: Build completes without errors.

**Step 4: Commit**

```bash
git add components/SegmentedControl.tsx components/ToggleGroup.tsx
git commit -m "feat: add SegmentedControl and ToggleGroup components"
```

---

## Task 7: Vibe Meter Component

**Files:**
- Create: `components/VibeMeter.tsx`

**Step 1: Create VibeMeter component**

Create `components/VibeMeter.tsx`:

```tsx
'use client';

import { VIBE_LEVELS } from '@/lib/constants';

interface VibeMeterProps {
  level: number;
  name: string;
  description: string;
}

export function VibeMeter({ level, name, description }: VibeMeterProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-stone-600">Party Vibe</span>
        <span className="text-sm text-stone-500">{level}/5</span>
      </div>

      <div className="flex gap-1">
        {VIBE_LEVELS.map((v) => (
          <div
            key={v.level}
            className={`flex-1 h-3 rounded-full transition-all duration-300
              ${v.level <= level
                ? v.level <= 2
                  ? 'bg-green-400'
                  : v.level <= 3
                  ? 'bg-amber-400'
                  : 'bg-red-400'
                : 'bg-stone-200'
              }`}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-stone-800">{name}</p>
        <p className="text-sm text-stone-500">{description}</p>
      </div>
    </div>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build completes without errors.

**Step 3: Commit**

```bash
git add components/VibeMeter.tsx
git commit -m "feat: add VibeMeter component"
```

---

## Task 8: Results Display Component

**Files:**
- Create: `components/Results.tsx`

**Step 1: Create Results component**

Create `components/Results.tsx`:

```tsx
'use client';

import { CalculatorResults, BarStyle } from '@/lib/types';
import { VibeMeter } from './VibeMeter';
import { STATE_NAMES } from '@/lib/constants';

interface ResultsProps {
  results: CalculatorResults;
  barStyle: BarStyle;
  state: string;
  serviceType: 'byob' | 'venue';
  qualityTier: 'budget' | 'mid' | 'premium';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Results({ results, barStyle, state, serviceType, qualityTier }: ResultsProps) {
  const qualityLabel = qualityTier === 'budget' ? 'budget' : qualityTier === 'mid' ? 'mid-range' : 'premium';
  const serviceLabel = serviceType === 'byob' ? 'BYOB' : 'venue';

  return (
    <div className="space-y-6">
      <VibeMeter
        level={results.vibeLevel}
        name={results.vibeName}
        description={results.vibeDescription}
      />

      <div className="h-px bg-stone-200" />

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-stone-600">You'll Need</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍺</span>
              <span className="text-stone-700">Beer</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-stone-800">
                {results.beerCases} cases
              </p>
              <p className="text-sm text-stone-500">
                {results.beerBottles} bottles
              </p>
            </div>
          </div>

          {barStyle !== 'beer' && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍷</span>
                <span className="text-stone-700">Wine</span>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-stone-800">
                  {results.wineBottles} bottles
                </p>
                <p className="text-sm text-stone-500">
                  {results.wineRed} red, {results.wineWhite} white
                </p>
              </div>
            </div>
          )}

          {barStyle === 'full' && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍸</span>
                <span className="text-stone-700">Spirits</span>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-stone-800">
                  {results.spiritBottles} bottles
                </p>
                <p className="text-sm text-stone-500">
                  {results.spiritBreakdown.vodka} vodka, {results.spiritBreakdown.whiskey} whiskey,
                  {results.spiritBreakdown.rum} rum, {results.spiritBreakdown.tequila} tequila
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-stone-200" />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-stone-600">Estimated Cost</h3>
        <p className="text-3xl font-bold text-stone-800">
          {formatCurrency(results.costLow)} – {formatCurrency(results.costHigh)}
        </p>
        <p className="text-sm text-stone-500">
          Based on {qualityLabel} {serviceLabel} pricing in {STATE_NAMES[state] || state}
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build completes without errors.

**Step 3: Commit**

```bash
git add components/Results.tsx
git commit -m "feat: add Results display component"
```

---

## Task 9: US Map Component

**Files:**
- Create: `components/USMap.tsx`

**Step 1: Install react-simple-maps**

Run:
```bash
npm install react-simple-maps
npm install -D @types/react-simple-maps
```

**Step 2: Create USMap component**

Create `components/USMap.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { STATE_NAMES } from '@/lib/constants';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// FIPS to state code mapping
const FIPS_TO_STATE: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY',
};

interface USMapProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
}

export function USMap({ selectedState, onStateSelect }: USMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-600">Location</label>
      <div className="relative">
        <ComposableMap
          projection="geoAlbersUsa"
          className="w-full"
          projectionConfig={{ scale: 1000 }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateCode = FIPS_TO_STATE[geo.id];
                const isSelected = stateCode === selectedState;
                const isHovered = stateCode === hoveredState;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredState(stateCode)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => stateCode && onStateSelect(stateCode)}
                    style={{
                      default: {
                        fill: isSelected ? '#d97706' : '#e7e5e4',
                        stroke: '#fff',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'fill 0.2s',
                      },
                      hover: {
                        fill: isSelected ? '#b45309' : '#fbbf24',
                        stroke: '#fff',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#b45309',
                        stroke: '#fff',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {hoveredState && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white px-3 py-1 rounded-lg text-sm shadow-lg">
            {STATE_NAMES[hoveredState]}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-stone-600">
        📍 {STATE_NAMES[selectedState]}
      </p>
    </div>
  );
}
```

**Step 3: Create mobile fallback dropdown**

Create `components/StateSelect.tsx`:

```tsx
'use client';

import { STATE_NAMES } from '@/lib/constants';

interface StateSelectProps {
  value: string;
  onChange: (state: string) => void;
}

export function StateSelect({ value, onChange }: StateSelectProps) {
  const states = Object.entries(STATE_NAMES).sort((a, b) => a[1].localeCompare(b[1]));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-600">Location</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-white border border-stone-300 rounded-lg text-stone-800
                   focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
      >
        {states.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Step 4: Verify components compile**

Run: `npm run build`
Expected: Build completes without errors.

**Step 5: Commit**

```bash
git add components/USMap.tsx components/StateSelect.tsx package.json package-lock.json
git commit -m "feat: add US Map and StateSelect components"
```

---

## Task 10: Input Panel Component

**Files:**
- Create: `components/InputPanel.tsx`

**Step 1: Create InputPanel component**

Create `components/InputPanel.tsx`:

```tsx
'use client';

import { CalculatorInputs, BarStyle, Intensity, AgeSkew, ServiceType, QualityTier } from '@/lib/types';
import { Slider } from './Slider';
import { SegmentedControl } from './SegmentedControl';
import { ToggleGroup } from './ToggleGroup';
import { USMap } from './USMap';
import { StateSelect } from './StateSelect';

interface InputPanelProps {
  inputs: CalculatorInputs;
  onUpdate: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  isMobile?: boolean;
}

const barStyleOptions = [
  { value: 'beer' as BarStyle, label: 'Beer Only', description: 'Casual, backyard BBQ vibe' },
  { value: 'beer-wine' as BarStyle, label: 'Beer & Wine', description: 'Classic, covers most crowds' },
  { value: 'full' as BarStyle, label: 'Full Bar', description: 'Beer, wine & cocktails' },
];

const intensityOptions = [
  { value: 'light' as Intensity, label: 'Light' },
  { value: 'moderate' as Intensity, label: 'Moderate' },
  { value: 'heavy' as Intensity, label: 'Heavy' },
];

const ageOptions = [
  { value: 'younger' as AgeSkew, label: 'Younger' },
  { value: 'mixed' as AgeSkew, label: 'Mixed' },
  { value: 'older' as AgeSkew, label: 'Older' },
];

const serviceOptions = [
  { value: 'byob' as ServiceType, label: 'BYOB' },
  { value: 'venue' as ServiceType, label: 'Venue/Catered' },
];

const qualityOptions = [
  { value: 'budget' as QualityTier, label: 'Budget' },
  { value: 'mid' as QualityTier, label: 'Mid-range' },
  { value: 'premium' as QualityTier, label: 'Premium' },
];

export function InputPanel({ inputs, onUpdate, isMobile = false }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <Slider
        label="Number of Guests"
        value={inputs.guests}
        min={10}
        max={500}
        step={5}
        onChange={(v) => onUpdate('guests', v)}
      />

      <Slider
        label="Event Duration"
        value={inputs.hours}
        min={2}
        max={8}
        unit=" hours"
        onChange={(v) => onUpdate('hours', v)}
      />

      <SegmentedControl
        label="Bar Style"
        options={barStyleOptions}
        value={inputs.barStyle}
        onChange={(v) => onUpdate('barStyle', v)}
      />

      <SegmentedControl
        label="Drinker Intensity"
        options={intensityOptions}
        value={inputs.intensity}
        onChange={(v) => onUpdate('intensity', v)}
      />

      <SegmentedControl
        label="Age of Crowd"
        options={ageOptions}
        value={inputs.ageSkew}
        onChange={(v) => onUpdate('ageSkew', v)}
      />

      <div className="h-px bg-stone-200" />

      <ToggleGroup
        label="Service Type"
        options={serviceOptions}
        value={inputs.serviceType}
        onChange={(v) => onUpdate('serviceType', v)}
      />

      <ToggleGroup
        label="Quality Tier"
        options={qualityOptions}
        value={inputs.qualityTier}
        onChange={(v) => onUpdate('qualityTier', v)}
      />

      <div className="h-px bg-stone-200" />

      {isMobile ? (
        <StateSelect
          value={inputs.state}
          onChange={(v) => onUpdate('state', v)}
        />
      ) : (
        <USMap
          selectedState={inputs.state}
          onStateSelect={(v) => onUpdate('state', v)}
        />
      )}
    </div>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build completes without errors.

**Step 3: Commit**

```bash
git add components/InputPanel.tsx
git commit -m "feat: add InputPanel component"
```

---

## Task 11: Share Functionality

**Files:**
- Create: `components/ShareButton.tsx`

**Step 1: Install html-to-image**

Run:
```bash
npm install html-to-image
```

**Step 2: Create ShareButton component**

Create `components/ShareButton.tsx`:

```tsx
'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { CalculatorInputs, CalculatorResults } from '@/lib/types';
import { STATE_NAMES } from '@/lib/constants';

interface ShareButtonProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  getShareUrl: () => string;
}

export function ShareButton({ inputs, results, getShareUrl }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = async () => {
    const url = getShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    if (!imageRef.current) return;

    // Temporarily show the hidden div
    imageRef.current.style.display = 'block';

    try {
      const dataUrl = await toPng(imageRef.current, {
        backgroundColor: '#fafaf9',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = 'pour-planner-results.png';
      link.href = dataUrl;
      link.click();
    } finally {
      imageRef.current.style.display = 'none';
    }

    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-full py-3 px-6 bg-amber-600 text-white font-semibold rounded-lg
                   hover:bg-amber-700 transition-colors"
      >
        Share Results
      </button>

      {showMenu && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-stone-200 overflow-hidden">
          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-4 text-left hover:bg-stone-50 transition-colors flex items-center gap-2"
          >
            <span>🔗</span>
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button
            onClick={handleDownloadImage}
            className="w-full py-3 px-4 text-left hover:bg-stone-50 transition-colors flex items-center gap-2 border-t border-stone-100"
          >
            <span>📷</span>
            <span>Download Image</span>
          </button>
        </div>
      )}

      {/* Hidden div for image generation */}
      <div
        ref={imageRef}
        style={{ display: 'none', width: '400px', padding: '32px' }}
        className="bg-stone-50"
      >
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-stone-800">Your Event Bar Plan</h2>
          <p className="text-stone-600">
            {inputs.guests} guests · {inputs.hours} hours · {STATE_NAMES[inputs.state]}
          </p>

          <div className="space-y-2 text-left py-4">
            <p className="text-lg">🍺 {results.beerCases} cases of beer</p>
            {inputs.barStyle !== 'beer' && (
              <p className="text-lg">🍷 {results.wineBottles} bottles of wine</p>
            )}
            {inputs.barStyle === 'full' && (
              <p className="text-lg">🍸 {results.spiritBottles} bottles of spirits</p>
            )}
          </div>

          <p className="text-xl font-semibold text-stone-800">
            Est. cost: ${results.costLow} – ${results.costHigh}
          </p>

          <p className="text-stone-600">
            Vibe: {results.vibeName} ({results.vibeLevel}/5)
          </p>

          <p className="text-sm text-amber-600 pt-4">pourplanner.com</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Verify component compiles**

Run: `npm run build`
Expected: Build completes without errors.

**Step 4: Commit**

```bash
git add components/ShareButton.tsx package.json package-lock.json
git commit -m "feat: add ShareButton with copy link and image download"
```

---

## Task 12: Main Page Assembly

**Files:**
- Modify: `app/page.tsx`

**Step 1: Create Calculator wrapper component**

Create `components/Calculator.tsx`:

```tsx
'use client';

import { useCalculator } from '@/hooks/useCalculator';
import { InputPanel } from './InputPanel';
import { Results } from './Results';
import { ShareButton } from './ShareButton';
import { useEffect, useState } from 'react';

export function Calculator() {
  const { inputs, results, updateInput, getShareUrl } = useCalculator();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-stone-800">Pour Planner</h1>
          <p className="text-sm text-stone-500">Smart alcohol calculator for your event</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <InputPanel
              inputs={inputs}
              onUpdate={updateInput}
              isMobile={isMobile}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-6 md:sticky md:top-8 md:self-start">
            <Results
              results={results}
              barStyle={inputs.barStyle}
              state={inputs.state}
              serviceType={inputs.serviceType}
              qualityTier={inputs.qualityTier}
            />

            <ShareButton
              inputs={inputs}
              results={results}
              getShareUrl={getShareUrl}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-stone-500">
          <p>Pour Planner - Plan your event bar with confidence</p>
        </div>
      </footer>
    </div>
  );
}
```

**Step 2: Update main page**

Update `app/page.tsx`:

```tsx
import { Suspense } from 'react';
import { Calculator } from '@/components/Calculator';

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">Loading...</p>
      </div>
    }>
      <Calculator />
    </Suspense>
  );
}
```

**Step 3: Verify app runs**

Run: `npm run dev`
Expected: Full calculator loads with inputs on left, results on right, all interactive.

**Step 4: Commit**

```bash
git add components/Calculator.tsx app/page.tsx
git commit -m "feat: assemble main calculator page"
```

---

## Task 13: Polish and Animations

**Files:**
- Modify: `components/Results.tsx`
- Modify: `components/VibeMeter.tsx`

**Step 1: Add number animation hook**

Create `hooks/useAnimatedNumber.ts`:

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useAnimatedNumber(target: number, duration: number = 300): number {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    const start = current;
    const diff = target - start;
    const startTime = performance.now();

    if (diff === 0) return;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(Math.round(start + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return current;
}
```

**Step 2: Update Results to use animated numbers**

Update the quantities section in `components/Results.tsx` to use `useAnimatedNumber`:

Add import at top:
```tsx
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
```

Inside the component, add:
```tsx
const animatedBeerCases = useAnimatedNumber(results.beerCases);
const animatedBeerBottles = useAnimatedNumber(results.beerBottles);
const animatedWineBottles = useAnimatedNumber(results.wineBottles);
const animatedSpiritBottles = useAnimatedNumber(results.spiritBottles);
const animatedCostLow = useAnimatedNumber(results.costLow);
const animatedCostHigh = useAnimatedNumber(results.costHigh);
```

Then use these animated values in the display (e.g., `{animatedBeerCases} cases`).

**Step 3: Verify animations work**

Run: `npm run dev`
Expected: Numbers animate smoothly when sliders change.

**Step 4: Commit**

```bash
git add hooks/useAnimatedNumber.ts components/Results.tsx
git commit -m "feat: add animated number transitions"
```

---

## Task 14: Final Testing

**Step 1: Run all tests**

Run: `npm run test:run`
Expected: All tests pass.

**Step 2: Test build**

Run: `npm run build`
Expected: Build completes without errors.

**Step 3: Test production build**

Run: `npm run start`
Expected: Production build runs correctly at http://localhost:3000

**Step 4: Manual testing checklist**

- [ ] Sliders update results in real-time
- [ ] Bar style changes quantities shown
- [ ] State selection works (map on desktop, dropdown on mobile)
- [ ] Vibe meter reflects intensity setting
- [ ] Cost reflects service type and quality tier
- [ ] Share link copies to clipboard
- [ ] Download image generates PNG
- [ ] URL updates as inputs change
- [ ] Shared URL loads with correct inputs

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Pour Planner v1.0"
```

---

## Summary

**Total tasks:** 14
**Estimated commits:** 14

**Key files created:**
- `lib/types.ts` - TypeScript types
- `lib/constants.ts` - Configuration constants
- `lib/calculator.ts` - Calculation logic
- `hooks/useCalculator.ts` - State management
- `hooks/useAnimatedNumber.ts` - Animation utility
- `components/Slider.tsx` - Slider input
- `components/SegmentedControl.tsx` - Multi-option selector
- `components/ToggleGroup.tsx` - Button group selector
- `components/VibeMeter.tsx` - Party vibe display
- `components/Results.tsx` - Results panel
- `components/USMap.tsx` - Interactive state map
- `components/StateSelect.tsx` - Mobile state dropdown
- `components/InputPanel.tsx` - All inputs assembled
- `components/ShareButton.tsx` - Share functionality
- `components/Calculator.tsx` - Main app wrapper
