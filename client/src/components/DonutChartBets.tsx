import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BetStats } from '../types';
import { PieChart as PieIcon, Trophy, TrendingDown } from 'lucide-react';

interface Props {
  stats: BetStats;
}

export const DonutChartBets: React.FC<Props> = ({ stats }) => {
  const data = [
    { name: 'Winning Bets', value: stats.won, color: '#10b981', amount: stats.totalAmountWon },
    { name: 'Losing Bets', value: stats.lost, color: '#ef4444', amount: stats.totalAmountLost },
  ];

  const totalBets = stats.won + stats.lost;
  const winRate = totalBets > 0 ? ((stats.won / totalBets) * 100).toFixed(1) : '0';

  return (
    <div className="clean-card rounded-2xl p-6 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Total Won and Lost Bets</h3>
            <p className="text-xs text-slate-500">Percentage of Betting Outcomes</p>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-700">
          Effectiveness: {winRate}%
        </div>
      </div>

      {/* Donut Chart Container */}
      <div className="relative h-60 w-full flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs">
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </p>
                      <p className="text-slate-600 mt-1 font-mono">
                        Count: <span className="font-bold text-slate-900">{item.value} bets</span>
                      </p>
                      <p className="text-slate-500 font-mono">
                        Total amount: <span className="font-bold text-emerald-600">${item.amount.toFixed(2)}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl font-black font-mono text-slate-900">{totalBets}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Bets</span>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Wins
            </span>
            <p className="text-lg font-black font-mono text-emerald-700 mt-0.5">{stats.won}</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600">${stats.totalAmountWon.toFixed(0)}</span>
        </div>

        <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-700 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Losses
            </span>
            <p className="text-lg font-black font-mono text-rose-700 mt-0.5">{stats.lost}</p>
          </div>
          <span className="text-xs font-mono font-bold text-rose-600">${stats.totalAmountLost.toFixed(0)}</span>
        </div>
      </div>

    </div>
  );
};
