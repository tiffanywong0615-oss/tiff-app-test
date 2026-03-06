'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Activity } from '@/types';
import { MapPin, Clock, DollarSign, Edit2, Trash2, GripVertical, ExternalLink, UtensilsCrossed, Camera, Train, Building, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

const typeConfig = {
  Food: { icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600', dot: 'bg-orange-400', label: '餐飲' },
  Sightseeing: { icon: Camera, color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-400', label: '觀光' },
  Transport: { icon: Train, color: 'bg-green-100 text-green-600', dot: 'bg-green-400', label: '交通' },
  Hotel: { icon: Building, color: 'bg-purple-100 text-purple-600', dot: 'bg-purple-400', label: '住宿' },
  Shopping: { icon: ShoppingBag, color: 'bg-pink-100 text-pink-600', dot: 'bg-pink-400', label: '購物' },
  Other: { icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: '其他' },
};

export default function ActivityCard({ activity, index, onEdit, onDelete }: ActivityCardProps) {
  const config = typeConfig[activity.type];
  const Icon = config.icon;

  return (
    <Draggable draggableId={activity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'flex gap-3 group',
            snapshot.isDragging && 'opacity-80'
          )}
        >
          {/* Timeline */}
          <div className="flex flex-col items-center flex-shrink-0 w-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="w-0.5 flex-1 bg-gray-100 mt-1 min-h-[20px]" />
          </div>

          {/* Card */}
          <div className={cn(
            'flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3 transition-all duration-200',
            'hover:shadow-md hover:border-pink-100',
            snapshot.isDragging && 'shadow-lg border-pink-200 rotate-1'
          )}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
                    {config.label}
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
                      查看地圖
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <div {...provided.dragHandleProps} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-grab active:cursor-grabbing text-gray-400">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button
                  onClick={() => onEdit(activity)}
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(activity.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
