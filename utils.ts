import { MetabolicEntry, DashboardStats, User } from './types';

export const calculateRatio = (glucose: number, ketones: number): number => {
  if (!ketones || ketones === 0) return 0;
  return parseFloat((glucose / ketones).toFixed(1));
};

export const formatCurrency = (val: number) => val.toLocaleString();

export const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  });
};

export const formatDateTime = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const getStats = (entries: MetabolicEntry[]): DashboardStats => {
  if (entries.length === 0) {
    return { currentWeight: 0, weightChange: 0, lastRatio: 0, avgRatio: 0, entriesCount: 0 };
  }

  // Sort by date descending for "current" stats
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const current = sorted[0];
  const previous = sorted.length > 1 ? sorted[1] : null;

  const currentWeight = current.weight;
  const weightChange = previous ? current.weight - previous.weight : 0;
  const lastRatio = current.ratio;
  
  const totalRatio = entries.reduce((acc, curr) => acc + curr.ratio, 0);
  const avgRatio = totalRatio / entries.length;

  return {
    currentWeight,
    weightChange: parseFloat(weightChange.toFixed(1)),
    lastRatio: parseFloat(lastRatio.toFixed(1)),
    avgRatio: parseFloat(avgRatio.toFixed(1)),
    entriesCount: entries.length
  };
};

export const exportToCSV = (entries: MetabolicEntry[]) => {
  const headers = ['Date', 'Time', 'User', 'State', 'Glucose', 'Ketones', 'Ratio', 'Weight', 'Body Fat %', 'Blood Pressure'];
  const rows = entries.map(e => {
    const d = new Date(e.timestamp);
    return [
      d.toLocaleDateString(),
      d.toLocaleTimeString(),
      e.userId,
      e.isFasted ? 'Fasted' : 'Fed',
      e.glucose,
      e.ketones,
      e.ratio.toFixed(1),
      e.weight,
      e.bodyFatPercentage || '',
      e.bloodPressure || ''
    ];
  });

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `metabolic_data_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
