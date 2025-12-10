import React, { useState, useEffect } from 'react';
import { PlusCircle, Activity, Scale, Calendar, User as UserIcon, Droplets } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { USERS, MetabolicEntry, User } from '../types';
import { calculateRatio, formatDate } from '../utils';
import { THERAPEUTIC_ZONE_LIMIT, generateId } from '../constants';

interface EntryFormProps {
  onAddEntry: (entry: MetabolicEntry) => void;
  currentUser: User;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onAddEntry, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [user, setUser] = useState<User>(currentUser);
  const [isFasted, setIsFasted] = useState(true);
  const [glucose, setGlucose] = useState<string>('');
  const [ketones, setKetones] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bf, setBf] = useState<string>('');
  const [bp, setBp] = useState('');
  
  // Calculated State
  const [ratio, setRatio] = useState<number | null>(null);

  // Sync user prop to state if form is closed (resetting default)
  useEffect(() => {
    if (!isOpen) setUser(currentUser);
  }, [currentUser, isOpen]);

  // Auto-calculate ratio
  useEffect(() => {
    const g = parseFloat(glucose);
    const k = parseFloat(ketones);
    if (!isNaN(g) && !isNaN(k) && k !== 0) {
      setRatio(calculateRatio(g, k));
    } else {
      setRatio(null);
    }
  }, [glucose, ketones]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!glucose || !ketones || !weight) return; // Basic validation

    const timestamp = new Date(`${date}T${time}`).toISOString();
    
    const newEntry: MetabolicEntry = {
      id: generateId(),
      timestamp,
      userId: user,
      isFasted,
      glucose: parseFloat(glucose),
      ketones: parseFloat(ketones),
      ratio: ratio || 0,
      weight: parseFloat(weight),
      bodyFatPercentage: bf ? parseFloat(bf) : undefined,
      bloodPressure: bp || undefined,
    };

    onAddEntry(newEntry);
    
    // Reset Form (Optional: keep user/weight for convenience, but for now full reset)
    setGlucose('');
    setKetones('');
    setWeight(''); // Could potentially keep previous weight
    setBf('');
    setBp('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-full shadow-2xl shadow-indigo-500/30 transition-all active:scale-95"
      >
        <PlusCircle className="w-6 h-6" />
        <span className="font-semibold text-lg">Log Entry</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg animate-in zoom-in-95 duration-200">
        <GlassCard 
          title="New Entry" 
          icon={<Activity className="w-5 h-5" />}
          action={
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              Cancel
            </button>
          }
          className="bg-slate-900 border-slate-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Date & User */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">User</label>
                <div className="relative">
                  <select 
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  >
                    {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <UserIcon className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Fasted Toggle */}
            <div className="flex items-center justify-between bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
              <span className="text-sm font-medium text-slate-300">Feeding State</span>
              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                <button 
                  type="button"
                  onClick={() => setIsFasted(true)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isFasted ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Fasted
                </button>
                <button 
                  type="button"
                  onClick={() => setIsFasted(false)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!isFasted ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Fed
                </button>
              </div>
            </div>

            {/* Row 3: Metabolic Data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Glucose (mg/dL)</label>
                <input 
                  type="number" 
                  value={glucose}
                  onChange={(e) => setGlucose(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-lg font-semibold text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder:font-normal placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Ketones (mmol/L)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={ketones}
                  onChange={(e) => setKetones(e.target.value)}
                  placeholder="e.g. 1.2"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-lg font-semibold text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder:font-normal placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {/* Ratio Display */}
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              ratio && ratio < THERAPEUTIC_ZONE_LIMIT 
                ? 'bg-emerald-900/20 border-emerald-500/30' 
                : 'bg-slate-800/30 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${ratio && ratio < THERAPEUTIC_ZONE_LIMIT ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">G/K Ratio</div>
                  <div className="text-xs text-slate-500">Target: &lt; 80</div>
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-slate-100">
                {ratio !== null ? ratio.toFixed(1) : '--'}
              </div>
            </div>

            {/* Row 4: Body Comp */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Weight (lbs)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Body Fat %</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={bf}
                  onChange={(e) => setBf(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">BP (opt)</label>
                <input 
                  type="text" 
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
            >
              Save Entry
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};