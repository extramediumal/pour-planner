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
