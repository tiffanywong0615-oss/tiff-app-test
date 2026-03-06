'use client';

import { TripProvider } from '@/context/TripContext';
import { LanguageProvider } from '@/context/LanguageContext';
import BottomNav from '@/components/BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <TripProvider>
        <div className="min-h-screen bg-[#FFF8FB]">
          <main className="min-h-screen bg-[#FFF8FB]">
            {children}
          </main>
          <BottomNav />
        </div>
      </TripProvider>
    </LanguageProvider>
  );
}
