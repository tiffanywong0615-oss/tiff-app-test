'use client';

import { useState } from 'react';
import './ActivityCard.css';
import { Activity } from '@/types';
import { useTripContext } from '@/context/TripContext';
import { useLanguage } from '@/context/LanguageContext';
import EditActivityModal from './EditActivityModal';
import { UtensilsCrossed, Camera, Train, Building, ShoppingBag, MoreHorizontal, Pencil, Clock, MapPin, ParkingCircle } from 'lucide-react';
import { JPY_TO_HKD } from '@/lib/currency';

interface ActivityCardProps {
    activity: Activity;
    tripId: string;
    dayIndex: number;
    translatedLocation?: string;
    translatedNotes?: string;
}

const typeConfig: Record<Activity['type'], { color: string; Icon: React.ElementType }> = {
    Food:        { color: '#F97316', Icon: UtensilsCrossed },
    Sightseeing: { color: '#3B82F6', Icon: Camera },
    Transport:   { color: '#22C55E', Icon: Train },
    Hotel:       { color: '#A855F7', Icon: Building },
    Shopping:    { color: '#EC4899', Icon: ShoppingBag },
    Other:       { color: '#94A3B8', Icon: MoreHorizontal },
};

const typeEmoji: Record<Activity['type'], string> = {
    Food:        '🍽️',
    Sightseeing: '📸',
    Transport:   '✈️',
    Hotel:       '🏨',
    Shopping:    '🛍️',
    Other:       '✨',
};

function formatCost(cost: number, costCurrency?: 'JPY' | 'HKD'): string {
    if (costCurrency === 'HKD') {
        const hkd = cost;
        const jpy = Math.round(cost / JPY_TO_HKD);
        return `HK$${hkd.toLocaleString()} / ¥${jpy.toLocaleString()}`;
    }
    const jpy = cost;
    const hkd = Math.round(jpy * JPY_TO_HKD);
    return `¥${jpy.toLocaleString()} / HK$${hkd.toLocaleString()}`;
}

const ActivityCard = ({ activity, tripId, dayIndex, translatedLocation, translatedNotes }: ActivityCardProps) => {
    const { updateActivity } = useTripContext();
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);

    const { color, Icon } = typeConfig[activity.type] ?? typeConfig.Other;
    const label = t.activityTypes[activity.type] ?? activity.type;

    const displayLocation = translatedLocation || activity.location;
    const displayNotes = translatedNotes || activity.notes;

    return (
        <>
            <div className="activity-card">
                <div className="activity-accent-bar" style={{ backgroundColor: color }} />
                <div className="activity-body">
                    <div className="activity-main-row">
                        <div className="activity-emoji-icon" style={{ backgroundColor: color + '20' }}>
                            <span>{typeEmoji[activity.type]}</span>
                        </div>
                        <div className="activity-content">
                            <div className="activity-type-row">
                                <span className="activity-time">
                                    <Clock size={13} />
                                    {activity.time}
                                </span>
                                <span className="activity-type-badge">
                                    <Icon size={12} />
                                    {label}
                                </span>
                            </div>

                            <p className="activity-location">
                                <span className="activity-title-prefix">{label}：</span>
                                {displayLocation}
                            </p>

                            {displayNotes && (
                                <p className="activity-highlights">✨ {t.highlights}{displayNotes}</p>
                            )}
                            {activity.mapQuery && (
                                <div className="activity-map-buttons">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.mapQuery)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="activity-map-btn"
                                    >
                                        <MapPin size={13} />
                                        {t.viewMap}
                                    </a>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=parking+near+${encodeURIComponent(activity.mapQuery)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="activity-map-btn activity-map-btn--parking"
                                    >
                                        <ParkingCircle size={13} />
                                        {t.nearestParking}
                                    </a>
                                </div>
                            )}

                            <div className="activity-footer">
                                <div>
                                    <span className="activity-cost">💴 {formatCost(activity.cost, activity.costCurrency)}</span>
                                </div>
                                <button
                                    className="activity-edit-btn"
                                    onClick={() => setIsEditing(true)}
                                    aria-label={t.editCost}
                                >
                                    <Pencil size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <EditActivityModal
                    activity={activity}
                    onClose={() => setIsEditing(false)}
                    onSave={(updates) => {
                        updateActivity(tripId, dayIndex, activity.id, updates);
                        setIsEditing(false);
                    }}
                />
            )}
        </>
    );
};

export default ActivityCard;