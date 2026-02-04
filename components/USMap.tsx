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
        {STATE_NAMES[selectedState]}
      </p>
    </div>
  );
}
