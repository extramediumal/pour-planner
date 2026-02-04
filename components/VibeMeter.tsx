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
