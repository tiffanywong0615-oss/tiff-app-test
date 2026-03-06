'use client';

import { useState, useEffect } from 'react';
import { Plus, Plane, Calendar, MapPin } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';
import TripCard from '@/components/TripCard';
import CreateTripModal from '@/components/CreateTripModal';
import { Trip } from '@/types';

export default function HomePage() {
  const { trips } = useTripContext();
  const [showModal, setShowModal] = useState(false);
  const [editTrip, setEditTrip] = useState<Trip | null>(null);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const upcomingTrip = trips
    .filter(t => t.status === 'planning')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  useEffect(() => {
    if (!upcomingTrip) return;
    const update = () => {
      const diff = new Date(upcomingTrip.startDate).getTime() - Date.now();
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
  }, [upcomingTrip]);

  const handleEdit = (trip: Trip) => {
    setEditTrip(trip);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen pt-16 md:pt-0 p-4 md:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2B2A33]">我的旅程</h1>
            <p className="text-gray-500 mt-1">規劃您的完美日本之旅 ✈️</p>
          </div>
          <button
            onClick={() => { setEditTrip(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:opacity-90 transition-all hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">新增旅程</span>
          </button>
        </div>

        {upcomingTrip && countdown && (
          <div className="mt-6 bg-gradient-to-r from-[#FF6FAE] to-[#FFE08A] rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="w-5 h-5" />
              <span className="font-semibold">{upcomingTrip.title} 倒數計時</span>
            </div>
            <div className="flex gap-4">
              {[
                { v: countdown.days, l: '天' },
                { v: countdown.hours, l: '時' },
                { v: countdown.minutes, l: '分' },
                { v: countdown.seconds, l: '秒' },
              ].map(({ v, l }) => (
                <div key={l} className="text-center bg-white/20 rounded-xl px-4 py-2 min-w-[60px]">
                  <div className="text-2xl font-bold">{String(v).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80">{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: '旅程數', value: trips.length, icon: MapPin, color: 'text-[#FF6FAE]', bg: 'bg-[#FFE1EE]' },
          { label: '計劃中', value: trips.filter(t => t.status === 'planning').length, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: '已完成', value: trips.filter(t => t.status === 'completed').length, icon: Plane, color: 'text-green-500', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-2`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-[#2B2A33]">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#FFE1EE] rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-10 h-10 text-[#FF6FAE]" />
          </div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">還沒有旅程</h3>
          <p className="text-gray-400 mb-6">點擊「新增旅程」開始規劃您的日本之旅！</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:opacity-90"
          >
            + 新增旅程
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateTripModal
          onClose={() => { setShowModal(false); setEditTrip(null); }}
          editTrip={editTrip}
        />
      )}
    </div>
  );
}
