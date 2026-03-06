'use client';

import { useState } from 'react';
import './ActivityCard.css';
import { Activity } from '@/types';
import { useTripContext } from '@/context/TripContext';
import EditActivityModal from './EditActivityModal';
import { UtensilsCrossed, Camera, Train, Building, ShoppingBag, MoreHorizontal, Pencil } from 'lucide-react';

interface ActivityCardProps {
    activity: Activity;
    tripId: string;
    dayIndex: number;
}

const typeConfig: Record<Activity['type'], { color: string; label: string; Icon: React.ElementType }> = {
    Food:        { color: '#F97316', label: '餐飲',   Icon: UtensilsCrossed },
    Sightseeing: { color: '#3B82F6', label: '觀光',   Icon: Camera },
    Transport:   { color: '#22C55E', label: '交通',   Icon: Train },
    Hotel:       { color: '#A855F7', label: '飯店',   Icon: Building },
    Shopping:    { color: '#EC4899', label: '購物',   Icon: ShoppingBag },
    Other:       { color: '#94A3B8', label: '其他',   Icon: MoreHorizontal },
};

const ActivityCard = ({ activity, tripId, dayIndex }: ActivityCardProps) => {
    const { updateActivity } = useTripContext();
    const [isEditing, setIsEditing] = useState(false);

    const { color, label, Icon } = typeConfig[activity.type] ?? typeConfig.Other;

    return (
        <>
            <div className="activity-card">
                <div className="activity-accent-bar" style={{ backgroundColor: color }} />
                <div className="activity-body">
                    <div className="activity-type-row">
                        <span className="activity-type-badge">
                            <Icon size={12} />
                            {label}
                        </span>
                        <span className="activity-time">{activity.time}</span>
                    </div>

                    <p className="activity-location">{activity.location}</p>

                    {activity.notes && (
                        <p className="activity-highlights">✨ 亮點：{activity.notes}</p>
                    )}
                    {activity.mapQuery && (
                        <p className="activity-map-query">📍 {activity.mapQuery}</p>
                    )}

                    <div className="activity-footer">
                        <span className="activity-cost">💴 ¥{activity.cost.toLocaleString()}</span>
                        <button
                            className="activity-edit-btn"
                            onClick={() => setIsEditing(true)}
                            aria-label="編輯活動"
                        >
                            <Pencil size={15} />
                        </button>
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
