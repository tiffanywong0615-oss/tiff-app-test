'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity } from '@/types';
import { MapPin, Clock, DollarSign, ExternalLink, UtensilsCrossed, Camera, Train, Building, ShoppingBag, MoreHorizontal, Edit2, Check, X, ParkingCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useTripContext } from '@/context/TripContext';

interface ActivityCardProps {
  activity: Activity;
  tripId: string;
  dayIndex: number;
}

const typeConfig = {
  Food: { icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600', dot: 'bg-orange-400', gradient: 'from-orange-400 to-orange-200', keyword: 'japan,food,restaurant' },
  Sightseeing: { icon: Camera, color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-400', gradient: 'from-blue-400 to-blue-200', keyword: 'japan,temple,nature' },
  Transport: { icon: Train, color: 'bg-green-100 text-green-600', dot: 'bg-green-400', gradient: 'from-green-400 to-green-200', keyword: 'japan,airport,train' },
  Hotel: { icon: Building, color: 'bg-purple-100 text-purple-600', dot: 'bg-purple-400', gradient: 'from-purple-400 to-purple-200', keyword: 'japan,hotel' },
  Shopping: { icon: ShoppingBag, color: 'bg-pink-100 text-pink-600', dot: 'bg-pink-400', gradient: 'from-pink-400 to-pink-200', keyword: 'japan,shopping' },
  Other: { icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', gradient: 'from-gray-400 to-gray-200', keyword: 'japan' },
};

async function translateText(text: string): Promise<string> {
  if (!text.trim()) return text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Translation request failed');
  const data = (await res.json()) as { responseData: { translatedText: string }; responseStatus: number };
  if (data.responseStatus !== 200) throw new Error('Translation failed');
  return data.responseData.translatedText;
}

export default function ActivityCard({ activity, tripId, dayIndex }: ActivityCardProps) {
  const { t, language } = useLanguage();
  const { updateActivity } = useTripContext();
  const config = typeConfig[activity.type];
  const Icon = config.icon;

  // Translation state
  const [translatedLocation, setTranslatedLocation] = useState(activity.location);
  const [translatedNotes, setTranslatedNotes] = useState(activity.notes);
  const [isTranslating, setIsTranslating] = useState(false);
  const translationCache = useRef<Record<string, { location: string; notes: string }>>({});

  // Inline cost edit state
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [costInput, setCostInput] = useState(String(activity.cost));

  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);

  // Fetch Wikipedia thumbnail photo
  useEffect(() => {
    if (!activity.mapQuery) return;
    setPhotoUrl(null);
    setPhotoError(false);

    const controller = new AbortController();
    const title = encodeURIComponent(activity.mapQuery.trim());
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: { thumbnail?: { source: string } }) => {
        if (data?.thumbnail?.source) {
          setPhotoUrl(data.thumbnail.source);
        } else {
          setPhotoError(true);
        }
      })
      .catch(err => { if (err?.name !== 'AbortError') setPhotoError(true); });
    return () => controller.abort();
  }, [activity.mapQuery]);

  const typeLabel = t.activityTypes[activity.type];

  // Translation effect
  useEffect(() => {
    if (language === 'zh') {
      setTranslatedLocation(activity.location);
      setTranslatedNotes(activity.notes);
      return;
    }

    const cacheKey = `${activity.id}_${language}`;
    if (translationCache.current[cacheKey]) {
      setTranslatedLocation(translationCache.current[cacheKey].location);
      setTranslatedNotes(translationCache.current[cacheKey].notes);
      return;
    }

    setIsTranslating(true);
    Promise.all([
      translateText(activity.location).catch(() => activity.location),
      translateText(activity.notes).catch(() => activity.notes),
    ]).then(([loc, notes]) => {
      translationCache.current[cacheKey] = { location: loc, notes };
      setTranslatedLocation(loc);
      setTranslatedNotes(notes);
      setIsTranslating(false);
    });
  }, [language, activity.id, activity.location, activity.notes]);

  // Cost editing handlers
  const handleStartEdit = () => {
    setCostInput(String(activity.cost));
    setIsEditingCost(true);
  };

  const handleSaveCost = () => {
    const newCost = parseFloat(costInput);
    if (!isNaN(newCost) && newCost >= 0) {
      updateActivity(tripId, dayIndex, activity.id, { cost: newCost });
    }
    setIsEditingCost(false);
  };

  const handleCancelEdit = () => {
    setIsEditingCost(false);
    setCostInput(String(activity.cost));
  };

  const showParkingLink = activity.mapQuery && activity.type !== 'Transport' && activity.type !== 'Hotel';
  const parkingUrl = `https://www.google.com/maps/search/parking+near+${encodeURIComponent(activity.mapQuery)}`;

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
        {activity.mapQuery && (
          <div className="w-full h-36 overflow-hidden bg-gray-100">
            {photoUrl && !photoError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={activity.location}
                className="w-full h-full object-cover"
                onError={() => setPhotoError(true)}
              />
            ) : photoError ? (
              <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                <Icon className="w-8 h-8 text-white/60" />
              </div>
            ) : (
              // Loading skeleton
              <div className="w-full h-full animate-pulse bg-gray-200" />
            )}
          </div>
        )}

        <div className={cn('p-4', isTranslating && 'opacity-70 transition-opacity duration-300')}>
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
                {isTranslating && (
                  <span className="text-xs text-gray-400 italic">{t.translating}</span>
                )}
              </div>
              <h4 className="font-semibold text-[#2B2A33] text-sm mt-1.5 leading-tight">
                {translatedLocation}
              </h4>
              {activity.notes && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{translatedNotes}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {/* Cost display or inline edit */}
                {isEditingCost ? (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-400">¥</span>
                    <input
                      type="number"
                      min="0"
                      value={costInput}
                      onChange={e => setCostInput(e.target.value)}
                      aria-label={t.editCost}
                      className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#FF6FAE]"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveCost();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button
                      onClick={handleSaveCost}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title={t.saveCost}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title={t.cancelEdit}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 group">
                    <DollarSign className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">¥{activity.cost.toLocaleString()}</span>
                    <button
                      onClick={handleStartEdit}
                      className="text-gray-300 hover:text-[#FF6FAE] transition-colors ml-0.5 opacity-0 group-hover:opacity-100"
                      title={t.editCost}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
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
                {showParkingLink && (
                  <a
                    href={parkingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#FF6FAE] flex items-center gap-1 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    <ParkingCircle className="w-3 h-3" />
                    {t.nearestParking}
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

