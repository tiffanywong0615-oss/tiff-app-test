'use client';

import { useTripContext } from '@/context/TripContext';
import { useLanguage } from '@/context/LanguageContext';
import BudgetChart from '@/components/BudgetChart';
import TopHeader from '@/components/TopHeader';
import { PieChart as PieChartIcon, TrendingUp, AlertTriangle } from 'lucide-react';

import { JPY_TO_HKD } from '@/lib/currency';

export default function BudgetPage() {
  const { trips } = useTripContext();
  const { t } = useLanguage();

  const trip = trips[0];

  const categoryConfig: Record<string, { color: string }> = {
    Food: { color: '#F97316' },
    Transport: { color: '#22C55E' },
    Hotel: { color: '#A855F7' },
    Sightseeing: { color: '#3B82F6' },
    Shopping: { color: '#EC4899' },
    Other: { color: '#94A3B8' },
  };

  if (!trip) {
    return (
      <div className="min-h-screen pt-14 pb-20 p-8 flex items-center justify-center bg-[#FFF8FB]">
        <TopHeader title={t.budget} />
        <p className="text-gray-400">尚無旅程資料。</p>
      </div>
    );
  }

  const spending: Record<string, number> = { Food: 0, Transport: 0, Hotel: 0, Sightseeing: 0, Shopping: 0, Other: 0 };
  trip.dailyItinerary.forEach(day => {
    day.activities.forEach(act => {
      const costInJpy = act.costCurrency === 'HKD' ? Math.round(act.cost / JPY_TO_HKD) : act.cost;
      spending[act.type] = (spending[act.type] || 0) + costInJpy;
    });
  });

  const totalBudget = trip.budget.total;
  const totalSpent = Object.values(spending).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercent = Math.min((totalSpent / totalBudget) * 100, 100);

  const chartData = Object.entries(categoryConfig).map(([key, { color }]) => ({
    name: t.activityTypes[key as keyof typeof t.activityTypes],
    value: spending[key] || 0,
    color,
  }));

  return (
    <div className="min-h-screen pt-14 pb-20 bg-[#FFF8FB]">
      <TopHeader title={t.budget} />

      <div className="p-4 md:p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#2B2A33]">{t.budget}</h1>
          <p className="text-gray-500 mt-0.5 text-sm">💰 {trip.title}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <PieChartIcon className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-gray-500">{t.totalBudget}</span>
            </div>
            <div className="text-2xl font-bold text-[#2B2A33]">¥{totalBudget.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm text-gray-500">{t.spent}</span>
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
              <span className="text-sm text-gray-500">{t.remaining}</span>
            </div>
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remaining >= 0 ? '+' : ''}¥{remaining.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <h2 className="text-lg font-bold text-[#2B2A33] mb-4">{t.spendingDistribution}</h2>
            <BudgetChart data={chartData} />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <h2 className="text-lg font-bold text-[#2B2A33] mb-4">{t.categoryBudget}</h2>
            <div className="space-y-4">
              {Object.entries(categoryConfig).map(([key, { color }]) => {
                const label = t.activityTypes[key as keyof typeof t.activityTypes];
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
                        style={{ width: `${percent}%`, backgroundColor: isOver ? '#EF4444' : color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
