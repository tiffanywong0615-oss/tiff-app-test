'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, PieChart, ShoppingBag, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useTripContext } from '@/context/TripContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { trips } = useTripContext();

  const firstTripId = trips[0]?.id;
  const itineraryHref = firstTripId ? `/trips/${firstTripId}` : '/';

  const navItems = [
    { href: itineraryHref, label: t.itinerary, icon: Map, test: (p: string) => p.startsWith('/trips') || p === '/' },
    { href: '/budget', label: t.budget, icon: PieChart, test: (p: string) => p === '/budget' },
    { href: '/toolbox', label: t.packingList, icon: ShoppingBag, test: (p: string) => p === '/toolbox' },
    { href: '/shopping', label: t.shoppingList, icon: ListChecks, test: (p: string) => p === '/shopping' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-pink-100 z-40 shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon, test }) => {
          const isActive = test(pathname);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all min-w-[72px]',
                isActive ? 'text-[#FF6FAE]' : 'text-gray-400 hover:text-[#FF6FAE]'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-[#FF6FAE]')} />
              <span className={cn('text-xs font-medium', isActive && 'text-[#FF6FAE]')}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
