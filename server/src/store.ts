import { Snail, BetStats, RaceResult } from './types';

// 6 Snails with custom colors
export const snails: Snail[] = [
  { id: 's1', name: 'Turbo Shell', color: '#10B981', speedRating: 95, victories: 2 },
  { id: 's2', name: 'Rayo Baboso', color: '#F59E0B', speedRating: 88, victories: 1 },
  { id: 's3', name: 'Flash Gastrópodo', color: '#6366F1', speedRating: 92, victories: 1 },
  { id: 's4', name: 'Speedy Gonzalo', color: '#EC4899', speedRating: 85, victories: 1 },
  { id: 's5', name: 'Caparazón Furia', color: '#8B5CF6', speedRating: 90, victories: 1 },
  { id: 's6', name: 'SnailMan', color: '#06B6D4', speedRating: 82, victories: 0 },
];

export const betStats: BetStats = {
  won: 8,
  lost: 4,
  totalAmountWon: 340,
  totalAmountLost: 120,
};

export const raceHistory: RaceResult[] = [
  { id: 'r1', raceNumber: 1, winnerId: 's1', winnerName: 'Turbo Shell', timestamp: '09:00 AM' },
  { id: 'r2', raceNumber: 2, winnerId: 's2', winnerName: 'Rayo Baboso', timestamp: '11:00 AM' },
  { id: 'r3', raceNumber: 3, winnerId: 's3', winnerName: 'Flash Gastrópodo', timestamp: '01:00 PM' },
  { id: 'r4', raceNumber: 4, winnerId: 's4', winnerName: 'Speedy Gonzalo', timestamp: '03:00 PM' },
  { id: 'r5', raceNumber: 5, winnerId: 's1', winnerName: 'Turbo Shell', timestamp: '05:00 PM' },
  { id: 'r6', raceNumber: 6, winnerId: 's5', winnerName: 'Caparazón Furia', timestamp: '07:00 PM' },
];
