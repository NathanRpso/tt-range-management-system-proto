export type BayStatus = 'available' | 'occupied' | 'golfer';

export interface Bay {
  id: string;
  number: number;
  label: string;
  status: BayStatus;
  screenOn: boolean;
  golferName?: string;
  sessionStarted?: string; // ISO string
  sessionDurationMin?: number;
  floor: 'ground' | 'upper';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  bays: string[];
  published: boolean;
  maxPlayers?: number;
  prizeInfo?: string;
  imageUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  registeredDate: string;
  totalSessions: number;
  totalShots: number;
  avgSessionMin: number;
  favoriteGame: string;
}

export interface DashboardData {
  totalShots: number;
  totalSessions: number;
  avgSessionMin: number;
  utilizationPct: number;
  shotsDelta: number;
  sessionsDelta: number;
  timeDelta: number;
  utilizationDelta: number;
}

export type NavTab =
  | 'home'
  | 'bays'
  | 'events'
  | 'displays'
  | 'dashboard'
  | 'overbet'
  | 'marketing'
  | 'support'
  | 'user-management'
  | 'range-settings'
  | 'profile';
