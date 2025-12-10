import React, { useState, useEffect } from 'react';
import { Download, LayoutDashboard, History as HistoryIcon, UserCircle, Activity } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { EntryForm } from './components/EntryForm';
import { USERS, MetabolicEntry, User } from './types';
import { STORAGE_KEY, SEED_DATA } from './constants';
import { getStats, exportToCSV } from './utils';

const App: React.FC = () => {
  const [entries, setEntries] = useState<MetabolicEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<User>('TC');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse data', e);
        setEntries(SEED_DATA);
      }
    } else {
      setEntries(SEED_DATA);
    }
  }, []);

  // Save Data
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const handleAddEntry = (entry: MetabolicEntry) => {
    setEntries(prev => [entry, ...prev]);
    // If the entry user is different from current, maybe switch? Or just stay.
    // Let's stay on current view but ensure the user knows data was added.
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  // Filter Data
  const filteredEntries = entries.filter(e => e.userId === currentUser);
  const stats = getStats(filteredEntries);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 pb-24">
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
               <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">Metabolic<span className="text-indigo-400">Tracker</span></h1>
          </div>

          <div className="flex items-center gap-3">
             {/* User Switcher */}
             <div className="relative group">
               <select 
                 value={currentUser}
                 onChange={(e) => setCurrentUser(e.target.value)}
                 className="appearance-none bg-slate-900 border border-slate-700 hover:border-indigo-500/50 text-sm rounded-full py-1.5 pl-4 pr-10 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
               >
                 {USERS.map(u => <option key={u} value={u}>{u}</option>)}
               </select>
               <UserCircle className="absolute right-3 top-1.5 w-5 h-5 text-slate-500 pointer-events-none" />
             </div>

             <button 
               onClick={() => exportToCSV(filteredEntries)}
               className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
               title="Export CSV"
             >
               <Download className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-slate-800 text-white shadow-lg shadow-indigo-500/10' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'history' 
                ? 'bg-slate-800 text-white shadow-lg shadow-indigo-500/10' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <HistoryIcon className="w-4 h-4" />
            History
          </button>
        </div>

        {/* View Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' ? (
            <Dashboard stats={stats} entries={filteredEntries} />
          ) : (
            <div className="max-w-2xl mx-auto">
               <History entries={filteredEntries} onDelete={handleDeleteEntry} />
            </div>
          )}
        </div>

      </main>

      {/* Floating Action Button */}
      <EntryForm onAddEntry={handleAddEntry} currentUser={currentUser} />

    </div>
  );
};

export default App;
