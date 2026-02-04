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
