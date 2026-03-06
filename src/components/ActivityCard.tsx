'use client';

import { useState } from 'react';
import { Activity } from '@/types';
import { MapPin, Clock, DollarSign, ExternalLink, UtensilsCrossed, Camera, Train, Building, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface ActivityCardProps {
  activity: Activity;
}

const typeConfig = {
  Food: { icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600', dot: 'bg-orange-400' },
  Sightseeing: { icon: Camera, color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-400' },
  Transport: { icon: Train, color: 'bg-green-100 text-green-600', dot: 'bg-green-400' },
  Hotel: { icon: Building, color: 'bg-purple-100 text-purple-600', dot: 'bg-purple-400' },
  Shopping: { icon: ShoppingBag, color: 'bg-pink-100 text-pink-600', dot: 'bg-pink-400' },
  Other: { icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { t } = useLanguage();
  const config = typeConfig[activity.type];
  const Icon = config.icon;
  const [imgVisible, setImgVisible] = useState(!!activity.mapQuery);
  const typeLabel = t.activityTypes[activity.type];

  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0 w-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-0.5 flex-1 bg-gray-100 mt-1 min-h-[20px]" />
      </div>

      {/* Card */}
      <div className={cn(
        'flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 mb-3 overflow-hidden',
        'hover:shadow-md hover:border-pink-100 transition-all duration-200'
      )}>
        {/* Destination photo */}
        {activity.mapQuery && imgVisible && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://source.unsplash.com/400x200/?${encodeURIComponent(activity.mapQuery)}`}
            alt={activity.location}
            className="w-full h-32 object-cover"
            onError={() => setImgVisible(false)}
            loading="lazy"
          />
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
                  {typeLabel}
                </span>
              </div>
              <h4 className="font-semibold text-[#2B2A33] text-sm mt-1.5 leading-tight">
                {activity.location}
              </h4>
              {activity.notes && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{activity.notes}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {activity.cost > 0 && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ¥{activity.cost.toLocaleString()}
                  </span>
                )}
                {activity.mapQuery && (
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(activity.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#FF6FAE] flex items-center gap-1 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    <MapPin className="w-3 h-3" />
                    {t.viewMap}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

