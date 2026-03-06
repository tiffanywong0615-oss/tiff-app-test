'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sun, Cloud, CloudRain, Snowflake, CloudSun, Plane, Calendar } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';
import { useLanguage } from '@/context/LanguageContext';
import DaySelector from '@/components/DaySelector';
import ActivityCard from '@/components/ActivityCard';
import TopHeader from '@/components/TopHeader';

const weatherIcons = {
  'sunny': Sun,
  'cloudy': Cloud,
  'partly-cloudy': CloudSun,
  'rainy': CloudRain,
  'snowy': Snowflake,
};

const weatherBgColors = {
  'sunny': 'bg-yellow-50',
  'cloudy': 'bg-gray-50',
  'partly-cloudy': 'bg-sky-50',
  'rainy': 'bg-blue-50',
  'snowy': 'bg-indigo-50',
};

const weatherTextColors = {
  'sunny': 'text-yellow-500',
  'cloudy': 'text-gray-500',
  'partly-cloudy': 'text-sky-500',
  'rainy': 'text-blue-500',
  'snowy': 'text-indigo-400',
};

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { trips } = useTripContext();
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(1);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const trip = trips.find(tr => tr.id === params.id);

  useEffect(() => {
    if (!trip) return;
    const update = () => {
      const diff = new Date(trip.startDate).getTime() - Date.now();
      if (diff <= 0) { setCountdown(null); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center bg-[#FFF8FB]">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{t.tripNotFound}</p>
          <button onClick={() => router.push('/')} className="text-[#FF6FAE] hover:underline">
            {t.backToHome}
          </button>
        </div>
      </div>
    );
  }

  const dayIndex = selectedDay - 1;
  const currentDay = trip.dailyItinerary[dayIndex];
  const totalDayCost = currentDay?.activities.reduce((acc, a) => acc + a.cost, 0) || 0;

  const weatherCondition = currentDay?.weather.condition as keyof typeof weatherIcons;
  const WeatherIcon = weatherIcons[weatherCondition] || Sun;
  const weatherBg = weatherBgColors[weatherCondition] || 'bg-yellow-50';
  const weatherText = weatherTextColors[weatherCondition] || 'text-yellow-500';
  const weatherLabel = t.weather[weatherCondition] || currentDay?.weather.condition;

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="min-h-screen pb-20 bg-[#FFF8FB]">
      <TopHeader title={trip.title} />

      {/* Hero Banner with Countdown */}
      <div className="pt-14 bg-gradient-to-r from-[#FF6FAE] to-[#FFE08A]">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-xs">
              {trip.startDate} — {trip.endDate} · {daysCount}{t.daysTrip}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mb-3">{trip.title}</h1>
          {countdown ? (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Plane className="w-3.5 h-3.5 text-white/70" />
                <p className="text-white/70 text-xs">{t.departureCountdown}</p>
              </div>
              <div className="flex gap-3">
                {[
                  { v: countdown.days, l: t.days },
                  { v: countdown.hours, l: t.hours },
                  { v: countdown.minutes, l: t.minutes },
                  { v: countdown.seconds, l: t.seconds },
                ].map(({ v, l }) => (
                  <div key={l} className="text-center bg-white/20 rounded-xl px-3 py-2 min-w-[52px]">
                    <div className="text-xl font-bold text-white">{String(v).padStart(2, '0')}</div>
                    <div className="text-xs text-white/80">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2 w-fit">
              <Plane className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{t.departed}</span>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Day Selector */}
      <DaySelector
        days={trip.dailyItinerary}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {/* Activity list */}
      <div className="px-4 pt-4">
        {/* Weather Banner */}
        {currentDay && (
          <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${weatherBg}`}>
            <WeatherIcon className={`w-6 h-6 flex-shrink-0 ${weatherText}`} />
            <div className="flex-1">
              <span className={`text-sm font-semibold ${weatherText}`}>{weatherLabel}</span>
              <span className="text-xs text-gray-500 ml-2">
                {t.high}{currentDay.weather.high}° / {t.low}{currentDay.weather.low}°
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">{currentDay.date}</div>
              {totalDayCost > 0 && (
                <div className="text-xs text-[#FF6FAE] font-medium">
                  {t.dailyCost} ¥{totalDayCost.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activities */}
        {!currentDay || currentDay.activities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">{t.noActivities}</p>
          </div>
        ) : (
          <div>
            {currentDay.activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
