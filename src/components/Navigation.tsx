'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, PieChart, Wrench, Menu, X, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '首頁', icon: Home },
  { href: '/trips', label: '行程規劃', icon: Map },
  { href: '/budget', label: '預算追蹤', icon: PieChart },
  { href: '/toolbox', label: '旅行工具', icon: Wrench },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6FAE] to-[#FFE08A] flex items-center justify-center shadow-md">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-[#2B2A33] leading-tight">日本</h1>
          <p className="text-xs text-gray-500">旅行規劃</p>
        </div>
      </div>
      <ul className="flex-1 px-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] text-white shadow-md'
                    : 'text-gray-600 hover:bg-[#FFE1EE] hover:text-[#FF6FAE]'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="px-6 py-6">
        <p className="text-xs text-gray-400 text-center">© 2026 日本旅行規劃</p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-md border-r border-pink-100 flex-col shadow-sm z-40">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-pink-100 flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6FAE] to-[#FFE08A] flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[#2B2A33]">日本旅行規劃</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-pink-50 text-gray-600"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
