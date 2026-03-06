'use client';

import { TripProvider } from '@/context/TripContext';
import { LanguageProvider } from '@/context/LanguageContext';
import BottomNav from '@/components/BottomNav';
import ScrollToTop from '@/components/ScrollToTop';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <TripProvider>
        <div className="min-h-screen bg-[#FFF8FB]">
          <main className="min-h-screen bg-[#FFF8FB]">
            {children}
          </main>
          <BottomNav />
          <ScrollToTop />
        </div>
      </TripProvider>
    </LanguageProvider>
  );
}
