export interface MetabolicEntry {
  id: string;
  timestamp: string; // ISO string
  userId: string;
  isFasted: boolean;
  glucose: number; // mg/dL
  ketones: number; // mmol/L
  ratio: number; // Calculated
  weight: number; // lbs
  bodyFatPercentage?: number;
  bloodPressure?: string;
}

export type User = string;

export const USERS: User[] = ['TC', 'Theresa', 'Guest'];

export interface DashboardStats {
  currentWeight: number;
  weightChange: number; // from last entry
  lastRatio: number;
  avgRatio: number;
  entriesCount: number;
}