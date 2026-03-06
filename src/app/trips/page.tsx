'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTripContext } from '@/context/TripContext';

export default function TripsPage() {
  const router = useRouter();
  const { trips } = useTripContext();

  useEffect(() => {
    if (trips.length > 0) {
      router.push(`/trips/${trips[0].id}`);
    } else {
      router.push('/');
    }
  }, [trips, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400">載入中...</div>
    </div>
  );
}
