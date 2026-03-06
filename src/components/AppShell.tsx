'use client';

import { TripProvider } from '@/context/TripContext';
import Navigation from '@/components/Navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TripProvider>
      <div className="flex min-h-screen">
        <Navigation />
        <main className="flex-1 md:ml-64 min-h-screen bg-[#FFF8FB]">
          {children}
        </main>
      </div>
    </TripProvider>
  );
}
