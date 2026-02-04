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
  if (intensity && ['very-light', 'light', 'moderate', 'heavy', 'very-heavy'].includes(intensity)) {
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
