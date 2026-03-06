'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTripContext } from '@/context/TripContext';

export default function HomePage() {
  const { trips } = useTripContext();
  const router = useRouter();

  useEffect(() => {
    if (trips.length > 0) {
      router.replace(`/trips/${trips[0].id}`);
    }
  }, [trips, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8FB]">
      <div className="w-8 h-8 border-4 border-[#FF6FAE] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
