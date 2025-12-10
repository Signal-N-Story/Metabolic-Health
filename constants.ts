import { MetabolicEntry } from './types';
import { v4 as uuidv4 } from 'uuid'; // We will simulate uuid with a simple random string generator in utils if needed, but for now assuming standard practice or simple string

export const STORAGE_KEY = 'metabolic-tracker-data';

// Helper to generate IDs if uuid package isn't available in this environment, 
// keeping it simple for single-file constraint awareness.
export const generateId = () => Math.random().toString(36).substring(2, 9);

export const SEED_DATA: MetabolicEntry[] = [
  {
    id: 'seed-1',
    timestamp: '2025-12-10T08:00:00.000Z', // Dec 10, 2025
    userId: 'TC',
    isFasted: true,
    glucose: 93,
    ketones: 1.2,
    ratio: 93 / 1.2, // 77.5
    weight: 197,
    bodyFatPercentage: 15.6,
  }
];

export const THERAPEUTIC_ZONE_LIMIT = 80;
