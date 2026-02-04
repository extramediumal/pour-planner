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
