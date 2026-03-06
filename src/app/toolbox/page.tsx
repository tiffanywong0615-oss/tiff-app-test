'use client';

import { useState } from 'react';
import { useTripContext } from '@/context/TripContext';
import { Check, Plus, Wrench, ArrowLeftRight, CheckSquare } from 'lucide-react';

// Fixed demonstration rate (approx. rate as of 2025). Not a live rate.
const JPY_TO_HKD = 0.055;

export default function ToolboxPage() {
  const { trips, toggleChecklistItem, addChecklistItem } = useTripContext();
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [newItem, setNewItem] = useState('');
  const [jpyAmount, setJpyAmount] = useState('');
  const [hkdAmount, setHkdAmount] = useState('');

  const trip = trips.find(t => t.id === selectedTripId) || trips[0];

  const completedCount = trip?.checklist.filter(i => i.completed).length || 0;
  const totalCount = trip?.checklist.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddItem = () => {
    if (!newItem.trim() || !trip) return;
    addChecklistItem(trip.id, newItem.trim());
    setNewItem('');
  };

  const handleJpyChange = (v: string) => {
    setJpyAmount(v);
    const num = parseFloat(v);
    setHkdAmount(isNaN(num) ? '' : (num * JPY_TO_HKD).toFixed(2));
  };

  const handleHkdChange = (v: string) => {
    setHkdAmount(v);
    const num = parseFloat(v);
    setJpyAmount(isNaN(num) ? '' : Math.round(num / JPY_TO_HKD).toString());
  };

  const handleSwap = () => {
    const tmpJpy = jpyAmount;
    setJpyAmount(hkdAmount);
    setHkdAmount(tmpJpy);
  };

  return (
    <div className="min-h-screen pt-16 md:pt-0 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2B2A33]">旅行工具</h1>
        <p className="text-gray-500 mt-1">出發前的必備清單 🧳</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <CheckSquare className="w-5 h-5" />
              <h2 className="text-lg font-bold">出發前確認清單</h2>
            </div>
            {trips.length > 1 && (
              <select
                value={selectedTripId}
                onChange={e => setSelectedTripId(e.target.value)}
                className="bg-white/20 border border-white/30 text-white rounded-lg px-3 py-1.5 text-sm w-full mb-3 focus:outline-none"
              >
                {trips.map(t => <option key={t.id} value={t.id} className="text-gray-800">{t.title}</option>)}
              </select>
            )}
            <div className="flex items-center justify-between text-sm text-white/80 mb-1.5">
              <span>{completedCount} / {totalCount} 項已完成</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="p-5">
            {!trip ? (
              <p className="text-gray-400 text-sm text-center py-4">請先建立旅程</p>
            ) : (
              <>
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
                  {trip.checklist.map(item => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <div
                        onClick={() => toggleChecklistItem(trip.id, item.id)}
                        className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all cursor-pointer ${
                          item.completed
                            ? 'bg-[#FF6FAE] border-[#FF6FAE]'
                            : 'border-gray-300 hover:border-[#FF6FAE]'
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm transition-colors ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {item.item}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                    placeholder="新增項目..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAE]"
                  />
                  <button
                    onClick={handleAddItem}
                    className="bg-gradient-to-r from-[#FF6FAE] to-[#ff8fc3] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Currency Converter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FFE08A] to-[#FFD060] p-5">
            <div className="flex items-center gap-3 mb-1">
              <Wrench className="w-5 h-5 text-[#2B2A33]" />
              <h2 className="text-lg font-bold text-[#2B2A33]">匯率換算</h2>
            </div>
            <p className="text-sm text-[#2B2A33]/70">1 JPY = {JPY_TO_HKD} HKD</p>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">日圓 (¥ JPY)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">¥</span>
                  <input
                    type="number"
                    value={jpyAmount}
                    onChange={e => handleJpyChange(e.target.value)}
                    placeholder="輸入日圓金額"
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE08A] text-lg font-semibold"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={handleSwap}
                  className="w-10 h-10 bg-[#FFE1EE] rounded-full flex items-center justify-center hover:bg-[#FF6FAE] hover:text-white transition-all group"
                >
                  <ArrowLeftRight className="w-4 h-4 text-[#FF6FAE] group-hover:text-white" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">港幣 (HK$ HKD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    type="number"
                    value={hkdAmount}
                    onChange={e => handleHkdChange(e.target.value)}
                    placeholder="輸入港幣金額"
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE08A] text-lg font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">快速換算</p>
              <div className="grid grid-cols-2 gap-2">
                {[1000, 5000, 10000, 50000].map(jpy => (
                  <button
                    key={jpy}
                    onClick={() => handleJpyChange(String(jpy))}
                    className="bg-[#FFF4C7] hover:bg-[#FFE08A] rounded-xl px-3 py-2.5 text-left transition-colors"
                  >
                    <div className="text-xs text-gray-500">¥{jpy.toLocaleString()}</div>
                    <div className="text-sm font-semibold text-[#2B2A33]">HK${(jpy * JPY_TO_HKD).toFixed(1)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
