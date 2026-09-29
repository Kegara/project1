import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Snail } from '../types';
import { Flag, Award } from 'lucide-react';

interface Props {
  snails: Snail[];
}

export const BarChartSnailVictories: React.FC<Props> = ({ snails }) => {
  const chartData = snails.map((snail) => ({
    name: snail.name,
    victories: snail.victories,
    color: snail.color,
    speed: snail.speedRating,
  }));

  const topSnail = [...snails].sort((a, b) => b.victories - a.victories)[0];

  return (
    <div className="clean-card rounded-2xl p-6 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Today Caracol's Victories</h3>
            <p className="text-xs text-slate-500">6 snails competing in 6 races a day</p>
          </div>
        </div>

        {topSnail && (
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold text-amber-800">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Leader: <strong className="text-slate-900">{topSnail.name}</strong> ({topSnail.victories} v.)</span>
          </div>
        )}
      </div>

      {/* Bar Chart Container */}
      <div className="h-60 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs">
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </p>
                      <p className="text-indigo-600 mt-1 font-mono">
                        Wins: <span className="font-bold text-slate-900">{item.victories}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="victories" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Snail Badges Summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-auto pt-4 border-t border-slate-100 text-center">
        {snails.map((s) => (
          <div
            key={s.id}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center"
          >
            <div className="w-2.5 h-2.5 rounded-full mb-1" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] text-slate-600 font-medium truncate max-w-full">{s.name}</span>
            <span className="text-xs font-mono font-bold text-slate-900 mt-0.5">{s.victories} 🏆</span>
          </div>
        ))}
      </div>

    </div>
  );
};
