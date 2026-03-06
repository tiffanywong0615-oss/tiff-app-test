'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Calendar, MapPin, Trash2, Edit } from 'lucide-react';
import { Trip } from '@/types';
import { useTripContext } from '@/context/TripContext';

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
}

export default function TripCard({ trip, onEdit }: TripCardProps) {
  const { deleteTrip } = useTripContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const today = new Date();
  const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const totalActivities = trip.dailyItinerary.reduce((acc, day) => acc + day.activities.length, 0);
  const totalCost = trip.dailyItinerary.reduce((acc, day) =>
    acc + day.activities.reduce((a, act) => a + act.cost, 0), 0);

  const statusColors = {
    planning: 'bg-blue-100 text-blue-600',
    ongoing: 'bg-green-100 text-green-600',
    completed: 'bg-gray-100 text-gray-600',
  };

  const statusLabels = {
    planning: '計劃中',
    ongoing: '進行中',
    completed: '已完成',
  };

  const formatDate = (d: Date) => `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group border border-pink-50">
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        {trip.coverImage ? (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const next = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (next) next.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full bg-gradient-to-br from-[#FF6FAE] to-[#FFE08A] flex items-center justify-center ${trip.coverImage ? 'hidden' : ''}`}>
          <MapPin className="w-12 h-12 text-white/70" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-10">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[trip.status]}`}>
            {statusLabels[trip.status]}
          </span>
        </div>
        {/* Three-dot menu */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
            className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
              <button
                onClick={(e) => { e.preventDefault(); onEdit(trip); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
              >
                <Edit className="w-4 h-4 text-[#FF6FAE]" />
                編輯
              </button>
              <button
                onClick={(e) => { e.preventDefault(); deleteTrip(trip.id); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                刪除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <Link href={`/trips/${trip.id}`} className="block p-4">
        <h3 className="font-bold text-[#2B2A33] text-lg mb-2 line-clamp-1">{trip.title}</h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(startDate)} — {formatDate(endDate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="bg-pink-50 text-[#FF6FAE] px-2 py-1 rounded-full font-medium">{daysCount} 天</span>
            <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded-full">{totalActivities} 個活動</span>
          </div>
          {daysUntil > 0 && trip.status === 'planning' && (
            <div className="text-right">
              <div className="text-xs text-gray-400">距離出發</div>
              <div className="text-sm font-bold text-[#FF6FAE]">{daysUntil} 天</div>
            </div>
          )}
        </div>
        {totalCost > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">已記錄花費</span>
            <span className="text-sm font-semibold text-[#2B2A33]">¥{totalCost.toLocaleString()}</span>
          </div>
        )}
      </Link>
    </div>
  );
}
