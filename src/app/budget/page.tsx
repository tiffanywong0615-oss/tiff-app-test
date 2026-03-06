'use client';

import { useTripContext } from '@/context/TripContext';
import BudgetChart from '@/components/BudgetChart';
import { PieChart as PieChartIcon, TrendingUp, AlertTriangle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const categoryConfig: Record<string, { label: string; color: string }> = {
  Food: { label: '餐飲', color: '#F97316' },
  Transport: { label: '交通', color: '#22C55E' },
  Hotel: { label: '住宿', color: '#A855F7' },
  Sightseeing: { label: '觀光', color: '#3B82F6' },
  Shopping: { label: '購物', color: '#EC4899' },
  Other: { label: '其他', color: '#94A3B8' },
};

export default function BudgetPage() {
  const { trips } = useTripContext();
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');

  const trip = trips.find(t => t.id === selectedTripId) || trips[0];

  if (!trip) {
    return (
      <div className="min-h-screen pt-16 md:pt-0 p-8 flex items-center justify-center">
        <p className="text-gray-400">尚無旅程資料，請先建立旅程。</p>
      </div>
    );
  }

  const spending: Record<string, number> = { Food: 0, Transport: 0, Hotel: 0, Sightseeing: 0, Shopping: 0, Other: 0 };
  trip.dailyItinerary.forEach(day => {
    day.activities.forEach(act => {
      spending[act.type] = (spending[act.type] || 0) + act.cost;
    });
  });

  const totalBudget = trip.budget.total;
  const totalSpent = Object.values(spending).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercent = Math.min((totalSpent / totalBudget) * 100, 100);

  const chartData = Object.entries(categoryConfig).map(([key, { label, color }]) => ({
    name: label,
    value: spending[key] || 0,
    color,
  }));

  return (
    <div className="min-h-screen pt-16 md:pt-0 p-4 md:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#2B2A33]">預算追蹤</h1>
            <p className="text-gray-500 mt-1">掌握旅行開支 💰</p>
          </div>
          {trips.length > 1 && (
            <div className="relative">
              <select
                value={selectedTripId}
                onChange={e => setSelectedTripId(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-[#2B2A33] focus:outline-none focus:ring-2 focus:ring-[#FF6FAE] cursor-pointer"
              >
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-gray-500">總預算</span>
          </div>
          <div className="text-2xl font-bold text-[#2B2A33]">¥{totalBudget.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm text-gray-500">已花費</span>
          </div>
          <div className="text-2xl font-bold text-[#2B2A33]">¥{totalSpent.toLocaleString()}</div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{spentPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${spentPercent > 90 ? 'bg-red-400' : 'bg-[#FF6FAE]'}`}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border ${remaining >= 0 ? 'bg-white border-gray-50' : 'bg-red-50 border-red-100'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${remaining >= 0 ? 'bg-green-50' : 'bg-red-100'}`}>
              {remaining >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <span className="text-sm text-gray-500">剩餘預算</span>
          </div>
          <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remaining >= 0 ? '+' : ''}¥{remaining.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <h2 className="text-lg font-bold text-[#2B2A33] mb-4">花費分佈</h2>
          <BudgetChart data={chartData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <h2 className="text-lg font-bold text-[#2B2A33] mb-4">各類別預算</h2>
          <div className="space-y-4">
            {Object.entries(categoryConfig).map(([key, { label, color }]) => {
              const budget = trip.budget.categoryBudgets[key as keyof typeof trip.budget.categoryBudgets];
              const spent = spending[key] || 0;
              const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
              const isOver = spent > budget;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      {isOver && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${isOver ? 'text-red-500' : 'text-[#2B2A33]'}`}>
                        ¥{spent.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">/ ¥{budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: isOver ? '#EF4444' : color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
