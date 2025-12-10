import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { MetabolicEntry, DashboardStats } from '../types';
import { WeightChart, MetabolicChart } from './Charts';
import { Scale, Activity, ArrowDown, ArrowUp, Zap } from 'lucide-react';
import { THERAPEUTIC_ZONE_LIMIT } from '../constants';

interface DashboardProps {
  stats: DashboardStats;
  entries: MetabolicEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, entries }) => {
  const isHealthyRatio = stats.lastRatio > 0 && stats.lastRatio < THERAPEUTIC_ZONE_LIMIT;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Weight Card */}
        <GlassCard className="p-4! pb-6!">
          <div className="flex items-start justify-between mb-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Scale className="w-5 h-5" />
            </span>
            {stats.weightChange !== 0 && (
              <span className={`text-xs font-bold flex items-center ${stats.weightChange < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.weightChange > 0 ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                {Math.abs(stats.weightChange)} lbs
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Weight</div>
            <div className="text-2xl font-bold text-white">{stats.currentWeight || '--'} <span className="text-sm font-normal text-slate-500">lbs</span></div>
          </div>
        </GlassCard>

        {/* Ratio Card */}
        <GlassCard className="p-4! pb-6!">
          <div className="flex items-start justify-between mb-2">
            <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <Zap className="w-5 h-5" />
            </span>
            {isHealthyRatio && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Optimal
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Latest Ratio</div>
            <div className={`text-2xl font-bold ${isHealthyRatio ? 'text-emerald-400' : 'text-white'}`}>
              {stats.lastRatio || '--'}
            </div>
          </div>
        </GlassCard>

        {/* Entries Count */}
        <GlassCard className="hidden md:block p-4! pb-6!">
           <div className="flex items-start justify-between mb-2">
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Activity className="w-5 h-5" />
            </span>
          </div>
           <div className="mt-2">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Logs</div>
            <div className="text-2xl font-bold text-white">{stats.entriesCount}</div>
          </div>
        </GlassCard>

        {/* Avg Ratio */}
        <GlassCard className="hidden md:block p-4! pb-6!">
          <div className="flex items-start justify-between mb-2">
             <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <Activity className="w-5 h-5" />
            </span>
          </div>
           <div className="mt-2">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Avg Ratio</div>
            <div className="text-2xl font-bold text-white">{stats.avgRatio || '--'}</div>
          </div>
        </GlassCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Weight Trend" className="h-[350px] flex flex-col">
          <div className="flex-1 w-full mt-4">
             <WeightChart entries={entries} />
          </div>
        </GlassCard>
        
        <GlassCard title="Metabolic Health" className="h-[350px] flex flex-col">
           <div className="flex-1 w-full mt-4">
             <MetabolicChart entries={entries} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
