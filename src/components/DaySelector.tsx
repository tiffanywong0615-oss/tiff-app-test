'use client';

import { DayItinerary } from '@/types';
import { Sun, Cloud, CloudRain, Snowflake, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface DaySelectorProps {
  days: DayItinerary[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const weatherIcons = {
  'sunny': Sun,
  'cloudy': Cloud,
  'partly-cloudy': CloudSun,
  'rainy': CloudRain,
  'snowy': Snowflake,
};

export default function DaySelector({ days, selectedDay, onSelectDay }: DaySelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border-b border-gray-100">
      <div
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          const date = new Date(day.date);
          const WeatherIcon = weatherIcons[day.weather.condition as keyof typeof weatherIcons] || Sun;
          const isSelected = selectedDay === day.day;
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');

          return (
            <button
              key={day.day}
              onClick={() => onSelectDay(day.day)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-3 min-w-[72px] flex-shrink-0 transition-all border-b-2',
                isSelected
                  ? 'border-[#FF6FAE] bg-[#FFF0F6]'
                  : 'border-transparent hover:bg-gray-50'
              )}
            >
              <span className={cn('text-xs font-semibold', isSelected ? 'text-[#FF6FAE]' : 'text-gray-400')}>
                {t.day}{day.day}{t.daySuffix}
              </span>
              <span className={cn('text-sm font-bold', isSelected ? 'text-[#FF6FAE]' : 'text-[#2B2A33]')}>
                {mm}/{dd}
              </span>
              <WeatherIcon className={cn('w-4 h-4', isSelected ? 'text-[#FF6FAE]' : 'text-gray-400')} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
