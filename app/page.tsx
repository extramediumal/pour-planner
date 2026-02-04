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
