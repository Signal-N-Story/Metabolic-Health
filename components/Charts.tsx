import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line, Legend } from 'recharts';
import { MetabolicEntry } from '../types';
import { formatDate } from '../utils';

interface ChartsProps {
  entries: MetabolicEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-slate-300 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const WeightChart: React.FC<ChartsProps> = ({ entries }) => {
  // Reverse entries to show chronological order left-to-right
  const data = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(e => ({
      date: formatDate(e.timestamp),
      weight: e.weight
    }));

  if (data.length === 0) return <div className="h-full flex items-center justify-center text-slate-500">No data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 10, fill: '#94a3b8' }} 
          axisLine={false} 
          tickLine={false}
          minTickGap={30}
        />
        <YAxis 
          domain={['dataMin - 2', 'dataMax + 2']} 
          tick={{ fontSize: 10, fill: '#94a3b8' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="weight" 
          stroke="#818cf8" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorWeight)" 
          name="Weight (lbs)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const MetabolicChart: React.FC<ChartsProps> = ({ entries }) => {
  const data = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(e => ({
      date: formatDate(e.timestamp),
      glucose: e.glucose,
      ketones: e.ketones,
      ratio: e.ratio
    }));

  if (data.length === 0) return <div className="h-full flex items-center justify-center text-slate-500">No data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
         <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false} 
            tickLine={false}
            minTickGap={30}
         />
         <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
         <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
         <Tooltip content={<CustomTooltip />} />
         <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
         
         <Area yAxisId="left" type="monotone" dataKey="glucose" fill="#f43f5e" stroke="#f43f5e" fillOpacity={0.1} name="Glucose" />
         <Bar yAxisId="left" dataKey="ratio" fill="#3b82f6" opacity={0.3} name="Ratio" barSize={20} radius={[4, 4, 0, 0]} />
         <Line yAxisId="right" type="monotone" dataKey="ketones" stroke="#10b981" strokeWidth={2} dot={{r: 4, fill:'#10b981'}} name="Ketones" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
