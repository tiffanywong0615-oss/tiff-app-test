'use client';

import { useState } from 'react';
import { X, Plus, UtensilsCrossed, Camera, Train, Building, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { Activity } from '@/types';

interface AddActivityModalProps {
  onClose: () => void;
  onAdd: (activity: Omit<Activity, 'id'>) => void;
}

const types: { type: Activity['type']; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'Food', label: '餐飲', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { type: 'Sightseeing', label: '觀光', icon: Camera, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { type: 'Transport', label: '交通', icon: Train, color: 'bg-green-100 text-green-600 border-green-200' },
  { type: 'Hotel', label: '住宿', icon: Building, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { type: 'Shopping', label: '購物', icon: ShoppingBag, color: 'bg-pink-100 text-pink-600 border-pink-200' },
  { type: 'Other', label: '其他', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600 border-gray-200' },
];

export default function AddActivityModal({ onClose, onAdd }: AddActivityModalProps) {
  const [selectedType, setSelectedType] = useState<Activity['type']>('Food');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState('');
  const [costCurrency, setCostCurrency] = useState<'JPY' | 'HKD'>('JPY');
  const [mapQuery, setMapQuery] = useState('');
  const [drivingToNext, setDrivingToNext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !location) return;
    const drivingVal = drivingToNext !== '' ? Number(drivingToNext) : undefined;
    onAdd({ time, type: selectedType, location, notes, cost: Number(cost) || 0, costCurrency, mapQuery, drivingToNext: drivingVal });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">新增活動</h2>
            <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">活動類型</label>
            <div className="grid grid-cols-3 gap-2">
              {types.map(({ type, label, icon: Icon, color }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    selectedType === type ? color + ' border-current' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">時間 *</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">地點/名稱 *</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="例：太宰府天滿宮"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">備註</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="活動備註..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">費用貨幣</label>
            <div className="flex gap-3">
              {(['JPY', 'HKD'] as const).map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="costCurrency" value={c} checked={costCurrency === c} onChange={() => setCostCurrency(c)} className="accent-[#FF6FAE]" />
                  <span className="text-sm">{c === 'JPY' ? '¥ JPY' : 'HK$ HKD'}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              費用 ({costCurrency === 'HKD' ? 'HK$' : '¥'})
            </label>
            <input
              type="number"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">地圖搜尋關鍵字</label>
            <input
              type="text"
              value={mapQuery}
              onChange={e => setMapQuery(e.target.value)}
              placeholder="例：太宰府天滿宮"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">駕車至下一站 (小時)</label>
            <input
              type="number"
              value={drivingToNext}
              onChange={e => setDrivingToNext(e.target.value)}
              placeholder="e.g. 1.5"
              min="0"
              step="0.5"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-50">
              取消
            </button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}