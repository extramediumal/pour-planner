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
