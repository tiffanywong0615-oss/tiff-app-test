'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Plus, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';
import DaySelector from '@/components/DaySelector';
import ActivityCard from '@/components/ActivityCard';
import AddActivityModal from '@/components/AddActivityModal';
import EditActivityModal from '@/components/EditActivityModal';
import { Activity } from '@/types';

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { trips, addActivity, updateActivity, deleteActivity, reorderActivities } = useTripContext();
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);

  const trip = trips.find(t => t.id === params.id);

  if (!trip) {
    return (
      <div className="min-h-screen pt-16 md:pt-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">找不到旅程</p>
          <button onClick={() => router.push('/')} className="text-[#FF6FAE] hover:underline">返回首頁</button>
        </div>
      </div>
    );
  }

  const dayIndex = selectedDay - 1;
  const currentDay = trip.dailyItinerary[dayIndex];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(currentDay.activities);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    reorderActivities(trip.id, dayIndex, items);
  };

  const totalDayCost = currentDay?.activities.reduce((acc, a) => acc + a.cost, 0) || 0;
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="min-h-screen pt-16 md:pt-0">
      <div className="bg-gradient-to-r from-[#FF6FAE] to-[#FFE08A] p-6 md:p-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">返回</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{trip.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {trip.startDate} — {trip.endDate}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {daysCount} 天行程
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-0 md:gap-6 p-4 md:p-8">
        <div className="md:w-64 flex-shrink-0 mb-4 md:mb-0">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">行程天數</h2>
          <DaySelector
            days={trip.dailyItinerary}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#2B2A33]">
                第 {selectedDay} 天行程
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {currentDay?.date}
                {totalDayCost > 0 && (
                  <span className="ml-2 text-[#FF6FAE] font-medium">· 今日花費 ¥{totalDayCost.toLocaleString()}</span>
                )}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              新增活動
            </button>
          </div>

          {currentDay?.activities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 mb-3">今天還沒有安排活動</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-[#FF6FAE] font-medium hover:underline text-sm"
              >
                + 新增第一個活動
              </button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="activities">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {currentDay.activities.map((activity, index) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        index={index}
                        onEdit={setEditActivity}
                        onDelete={(id) => deleteActivity(trip.id, dayIndex, id)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddActivityModal
          onClose={() => setShowAddModal(false)}
          onAdd={(activity) => addActivity(trip.id, dayIndex, activity)}
        />
      )}
      {editActivity && (
        <EditActivityModal
          activity={editActivity}
          onClose={() => setEditActivity(null)}
          onSave={(updates) => updateActivity(trip.id, dayIndex, editActivity.id, updates)}
        />
      )}
    </div>
  );
}
