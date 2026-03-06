'use client';

import { useLanguage } from '@/context/LanguageContext';

interface TopHeaderProps {
  title: string;
}

export default function TopHeader({ title }: TopHeaderProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-pink-100 flex items-center justify-between px-4 z-40 shadow-sm">
      <h1 className="font-bold text-[#2B2A33] text-base truncate max-w-[220px]">{title}</h1>
      <button
        onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
        className="text-xs font-semibold bg-[#FFE1EE] text-[#FF6FAE] px-3 py-1.5 rounded-lg hover:bg-[#FF6FAE] hover:text-white transition-all flex-shrink-0"
      >
        {language === 'zh' ? 'EN' : '中'}
      </button>
    </header>
  );
}
