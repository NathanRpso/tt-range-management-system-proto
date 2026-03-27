import { Bay, Event, Player, DashboardData } from '@/types';

export const mockBays: Bay[] = [
  { id: 'b1', number: 1, label: 'Bay 1', status: 'golfer',    screenOn: true,  golferName: 'J. Maverick',  sessionStarted: '2026-03-27T09:15:00', sessionDurationMin: 47, floor: 'ground' },
  { id: 'b2', number: 2, label: 'Bay 2', status: 'available', screenOn: true,  floor: 'ground' },
  { id: 'b3', number: 3, label: 'Bay 3', status: 'occupied',  screenOn: true,  golferName: 'C. Reeves',    sessionStarted: '2026-03-27T09:30:00', sessionDurationMin: 32, floor: 'ground' },
  { id: 'b4', number: 4, label: 'Bay 4', status: 'available', screenOn: true,  floor: 'ground' },
  { id: 'b5', number: 5, label: 'Bay 5', status: 'golfer',    screenOn: true,  golferName: 'T. Holloway',  sessionStarted: '2026-03-27T08:45:00', sessionDurationMin: 72, floor: 'ground' },
  { id: 'b6', number: 6, label: 'Bay 6', status: 'available', screenOn: false, floor: 'ground' },
  { id: 'b7', number: 7, label: 'Bay 7', status: 'available', screenOn: true,  floor: 'ground' },
  { id: 'b8', number: 8, label: 'Bay 8', status: 'golfer',    screenOn: true,  golferName: 'Nathan Ade',   sessionStarted: '2026-03-27T09:00:00', sessionDurationMin: 58, floor: 'ground' },
  { id: 'b9', number: 9, label: 'Bay 9', status: 'occupied',  screenOn: true,  golferName: 'R. Strand',    sessionStarted: '2026-03-27T09:50:00', sessionDurationMin: 18, floor: 'ground' },
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Friday Night Scramble',
    description: 'Weekly scramble competition open to all skill levels. Top 3 scores win prizes.',
    startDate: '2026-03-14',
    endDate: '2026-03-14',
    startTime: '18:00',
    endTime: '21:00',
    bays: ['b2', 'b3', 'b5', 'b6'],
    published: true,
    maxPlayers: 32,
    prizeInfo: '1st: $100 credit, 2nd: $50 credit, 3rd: $25 credit',
  },
  {
    id: 'e2',
    title: 'Junior Golf Clinic',
    description: 'Coaching session for juniors aged 8–16. Spaces limited.',
    startDate: '2026-03-19',
    endDate: '2026-03-19',
    startTime: '10:00',
    endTime: '12:00',
    bays: ['b5', 'b6'],
    published: true,
    maxPlayers: 12,
  },
  {
    id: 'e3',
    title: 'Spring Championship',
    description: 'Annual spring championship with cash prizes for top performers.',
    startDate: '2026-03-28',
    endDate: '2026-03-28',
    startTime: '09:00',
    endTime: '17:00',
    bays: ['b2', 'b3', 'b5', 'b6', 'b8', 'b9'],
    published: false,
    maxPlayers: 64,
    prizeInfo: '1st: $500, 2nd: $250, 3rd: $100',
  },
  {
    id: 'e4',
    title: 'Corporate Day – Rapsodo',
    description: 'Private corporate event booking.',
    startDate: '2026-03-25',
    endDate: '2026-03-25',
    startTime: '13:00',
    endTime: '17:00',
    bays: ['b2', 'b3', 'b5'],
    published: false,
    maxPlayers: 20,
  },
];

export const mockPlayers: Player[] = [
  { id: 'p1', name: 'J. Maverick',   email: 'j.maverick@email.com',   registeredDate: '2025-08-15', totalSessions: 42, totalShots: 3840, avgSessionMin: 54, favoriteGame: 'Closest to Pin' },
  { id: 'p2', name: 'C. Reeves',     email: 'c.reeves@email.com',     registeredDate: '2025-09-02', totalSessions: 28, totalShots: 2310, avgSessionMin: 48, favoriteGame: 'TopDrive' },
  { id: 'p3', name: 'T. Holloway',   email: 't.holloway@email.com',   registeredDate: '2025-07-20', totalSessions: 67, totalShots: 6120, avgSessionMin: 61, favoriteGame: 'Range Mode' },
  { id: 'p4', name: 'R. Strand',     email: 'r.strand@email.com',     registeredDate: '2026-01-10', totalSessions: 15, totalShots:  980, avgSessionMin: 42, favoriteGame: 'Closest to Pin' },
  { id: 'p5', name: 'Nathan Ade',    email: 'nathan.ade@email.com',   registeredDate: '2025-11-05', totalSessions: 33, totalShots: 2870, avgSessionMin: 57, favoriteGame: 'TopDrive' },
  { id: 'p6', name: 'S. Okafor',     email: 's.okafor@email.com',     registeredDate: '2025-10-18', totalSessions: 21, totalShots: 1540, avgSessionMin: 45, favoriteGame: 'Range Mode' },
  { id: 'p7', name: 'D. Lim',        email: 'd.lim@email.com',        registeredDate: '2026-02-01', totalSessions:  9, totalShots:  620, avgSessionMin: 39, favoriteGame: 'Closest to Pin' },
  { id: 'p8', name: 'P. Whitmore',   email: 'p.whitmore@email.com',   registeredDate: '2025-06-12', totalSessions: 88, totalShots: 8950, avgSessionMin: 68, favoriteGame: 'TopDrive' },
  { id: 'p9', name: 'A. Ferreira',   email: 'a.ferreira@email.com',   registeredDate: '2026-01-25', totalSessions: 18, totalShots: 1320, avgSessionMin: 51, favoriteGame: 'Range Mode' },
  { id: 'p10', name: 'K. Osei',      email: 'k.osei@email.com',       registeredDate: '2025-12-08', totalSessions: 26, totalShots: 2190, avgSessionMin: 55, favoriteGame: 'Closest to Pin' },
];

export const mockDashboard: DashboardData = {
  totalShots: 18542,
  totalSessions: 2714,
  avgSessionMin: 52,
  utilizationPct: 81,
  shotsDelta: 3.8,
  sessionsDelta: -1.4,
  timeDelta: 2.1,
  utilizationDelta: 1.9,
};

export const gameModeData = [
  { name: 'Range Mode',       sessions: 1004, pct: 37 },
  { name: 'Closest to Pin',   sessions:  625, pct: 23 },
  { name: 'TopDrive',         sessions:  543, pct: 20 },
  { name: 'Around the World', sessions:  325, pct: 12 },
  { name: 'Bullseye',         sessions:  136, pct:  5 },
  { name: 'Other',            sessions:   81, pct:  3 },
];

// Per-bay shot counts for 9 bays (used in Dashboard bay activity chart)
export const bayActivityData = [
  { bay: 1, shots: 1840 },
  { bay: 2, shots: 2210 },
  { bay: 3, shots: 1970 },
  { bay: 4, shots: 2540 },
  { bay: 5, shots: 2880 },
  { bay: 6, shots: 1420 },
  { bay: 7, shots: 2100 },
  { bay: 8, shots: 2390 },
  { bay: 9, shots: 1192 },
];

// Over-net shots referencing bays 1-9
export const mockOverNetShots = [
  { bay: 8, time: '2026-03-15 15:19:12', height: 12.88, highlight: false },
  { bay: 8, time: '2026-03-15 14:33:18', height: 10.97, highlight: true  },
  { bay: 6, time: '2026-03-14 18:05:52', height:  3.00, highlight: false },
  { bay: 2, time: '2026-03-14 17:54:21', height: 27.30, highlight: true  },
  { bay: 6, time: '2026-03-14 17:36:20', height: 15.29, highlight: false },
  { bay: 6, time: '2026-03-14 17:35:19', height: 11.38, highlight: true  },
  { bay: 6, time: '2026-03-14 17:34:49', height:  4.69, highlight: false },
  { bay: 6, time: '2026-03-14 17:34:28', height: 14.84, highlight: true  },
  { bay: 6, time: '2026-03-14 17:31:14', height: 25.39, highlight: false },
  { bay: 6, time: '2026-03-14 17:27:47', height: 16.00, highlight: true  },
  { bay: 6, time: '2026-03-14 17:11:38', height: 24.86, highlight: false },
  { bay: 6, time: '2026-03-14 17:11:16', height: 21.29, highlight: true  },
  { bay: 6, time: '2026-03-14 17:08:02', height: 13.96, highlight: false },
  { bay: 6, time: '2026-03-14 17:06:35', height:  2.31, highlight: false },
  { bay: 6, time: '2026-03-14 17:00:45', height: 21.61, highlight: false },
  { bay: 5, time: '2026-03-14 16:49:40', height: 27.48, highlight: false },
  { bay: 4, time: '2026-03-14 16:30:11', height:  8.72, highlight: false },
  { bay: 3, time: '2026-03-14 15:55:02', height: 19.44, highlight: false },
  { bay: 9, time: '2026-03-14 15:22:47', height:  5.18, highlight: false },
  { bay: 1, time: '2026-03-14 14:10:33', height: 31.06, highlight: false },
];
