import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DonutChartBets } from '../components/DonutChartBets';
import { BarChartSnailVictories } from '../components/BarChartSnailVictories';
import { SnailPayDrawer } from '../components/SnailPayDrawer';
import { Wallet, Trophy, TrendingUp, Flame, RefreshCw, BarChart2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, snails, betStats, setIsSnailPayOpen, refreshStats } = useAuth();

  if (!user) return null;

  const totalBets = betStats.won + betStats.lost;
  const winRate = totalBets > 0 ? ((betStats.won / totalBets) * 100).toFixed(0) : '0';
  const topSnail = [...snails].sort((a, b) => b.victories - a.victories)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      
      {/* Top Header Card - Balance & Quick Recarga */}
      <div className="clean-panel rounded-2xl p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Account Balance</span>
          <div className="text-3xl font-black font-mono text-emerald-600 mt-0.5 flex items-baseline gap-1">
            ${user.balance.toFixed(2)}
            <span className="text-xs font-normal text-slate-500">USD</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsSnailPayOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Top Up via SnailPay</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
        
        <div className="clean-card rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Total Winning Bets</p>
            <p className="text-xl font-black font-mono text-emerald-600 mt-0.5">{betStats.won}</p>
          </div>
        </div>

        <div className="clean-card rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Efficacy Rate</p>
            <p className="text-xl font-black font-mono text-indigo-600 mt-0.5">{winRate}%</p>
          </div>
        </div>

        <div className="clean-card rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Total Earnings</p>
            <p className="text-xl font-black font-mono text-amber-600 mt-0.5">${betStats.totalAmountWon.toFixed(0)}</p>
          </div>
        </div>

        <div className="clean-card rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            <span className="text-lg">🐌</span>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Top Snail</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate max-w-[110px]">
              {topSnail ? topSnail.name : 'N/A'}
            </p>
          </div>
        </div>

      </div>

      {/* CHARTS SECTION (GRID VIEW ONLY AS REQUESTED) */}
      <section className="space-y-4 mt-7">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Betting and Racing Statistics</h2>
          </div>

        </div>

        {/* Pure Grid View (Donut + Bar side-by-side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[380px]">
          <DonutChartBets stats={betStats} />
          <BarChartSnailVictories snails={snails} />
        </div>

      </section>

      {/* SnailPay Drawer Component */}
      <SnailPayDrawer />

    </div>
  );
};
