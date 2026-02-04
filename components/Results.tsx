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
