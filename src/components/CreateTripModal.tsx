'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';
import { Trip } from '@/types';

interface CreateTripModalProps {
  onClose: () => void;
  editTrip?: Trip | null;
}

export default function CreateTripModal({ onClose, editTrip }: CreateTripModalProps) {
  const { createTrip, updateTrip } = useTripContext();
  const [title, setTitle] = useState(editTrip?.title || '');
  const [startDate, setStartDate] = useState(editTrip?.startDate || '');
  const [endDate, setEndDate] = useState(editTrip?.endDate || '');
  const [coverImage, setCoverImage] = useState(editTrip?.coverImage || '');

  const days = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;
    if (editTrip) {
      updateTrip(editTrip.id, { title, startDate, endDate, coverImage });
    } else {
      createTrip({ title, startDate, endDate, coverImage });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{editTrip ? '編輯旅程' : '新增旅程'}</h2>
            <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-1">規劃您的完美日本之旅</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">旅程名稱 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例：九州美食之旅"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE] focus:border-transparent"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">出發日期 *</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">回程日期 *</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
                required
              />
            </div>
          </div>
          {days > 0 && (
            <p className="text-xs text-[#FF6FAE] font-medium">共 {days} 天旅程</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">封面圖片 URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {editTrip ? '儲存' : '建立旅程'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
