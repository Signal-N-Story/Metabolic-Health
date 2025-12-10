import React from 'react';
import { MetabolicEntry } from '../types';
import { formatDateTime, calculateRatio } from '../utils';
import { Droplets, Calendar, User } from 'lucide-react';
import { THERAPEUTIC_ZONE_LIMIT } from '../constants';

interface HistoryProps {
  entries: MetabolicEntry[];
  onDelete: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ entries, onDelete }) => {
  // Sort descending
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (sorted.length === 0) {
    return <div className="text-center py-10 text-slate-500">No history found. Start tracking!</div>;
  }

  return (
    <div className="space-y-4">
      {sorted.map((entry) => (
        <div 
          key={entry.id} 
          className="group relative bg-slate-900/40 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-800/60"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                entry.isFasted 
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {entry.isFasted ? 'FASTED' : 'FED'}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDateTime(entry.timestamp)}
              </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
              className="text-xs text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Glucose</div>
              <div className="text-lg font-semibold text-slate-200">{entry.glucose}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Ketones</div>
              <div className="text-lg font-semibold text-emerald-400">{entry.ketones}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Weight</div>
              <div className="text-lg font-semibold text-slate-200">{entry.weight} <span className="text-xs font-normal text-slate-500">lbs</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Ratio</div>
              <div className={`text-lg font-bold ${
                entry.ratio < THERAPEUTIC_ZONE_LIMIT ? 'text-green-400' : 'text-slate-400'
              }`}>
                {entry.ratio.toFixed(1)}
              </div>
            </div>
          </div>
          
          {entry.bodyFatPercentage && (
             <div className="mt-3 pt-3 border-t border-slate-800 flex gap-4 text-xs text-slate-400">
               <span>BF: <span className="text-slate-200">{entry.bodyFatPercentage}%</span></span>
               {entry.bloodPressure && <span>BP: <span className="text-slate-200">{entry.bloodPressure}</span></span>}
               <span className="ml-auto flex items-center gap-1 text-slate-600"><User className="w-3 h-3"/> {entry.userId}</span>
             </div>
          )}
        </div>
      ))}
    </div>
  );
};
