'use client';

import { DayItinerary } from '@/types';
import { Sun, Cloud, CloudRain, Snowflake, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const weatherColors = {
  'sunny': 'text-yellow-500',
  'cloudy': 'text-gray-400',
  'partly-cloudy': 'text-blue-400',
  'rainy': 'text-blue-500',
  'snowy': 'text-blue-200',
};

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

export default function DaySelector({ days, selectedDay, onSelectDay }: DaySelectorProps) {
  return (
    <div className="space-y-2">
      {days.map((day) => {
        const date = new Date(day.date);
        const weekday = weekdays[date.getDay()];
        const WeatherIcon = weatherIcons[day.weather.condition];
        const weatherColor = weatherColors[day.weather.condition];
        const isSelected = selectedDay === day.day;

        return (
          <button
            key={day.day}
            onClick={() => onSelectDay(day.day)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl transition-all duration-200',
              isSelected
                ? 'bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] text-white shadow-md'
                : 'bg-white hover:bg-pink-50 border border-gray-100 hover:border-pink-200'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={cn('text-xs font-medium', isSelected ? 'text-white/80' : 'text-gray-400')}>
                  第 {day.day} 天 · 週{weekday}
                </div>
                <div className={cn('text-sm font-bold mt-0.5', isSelected ? 'text-white' : 'text-[#2B2A33]')}>
                  {String(date.getMonth()+1).padStart(2,'0')}/{String(date.getDate()).padStart(2,'0')}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={cn('flex items-center gap-1', isSelected ? 'text-white' : weatherColor)}>
                    <WeatherIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">{day.weather.high}°</span>
                  </div>
                  <div className={cn('text-xs', isSelected ? 'text-white/70' : 'text-gray-400')}>
                    {day.weather.low}°
                  </div>
                </div>
                <div className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  isSelected ? 'bg-white/20 text-white' : 'bg-pink-50 text-[#FF6FAE]'
                )}>
                  {day.activities.length}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
