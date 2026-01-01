// Timer & Settings Types for SoloRank

export type TimerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
export type TimerSize = 'small' | 'medium' | 'large';
export type TimerFormat = 'remaining' | 'elapsed';
export type AlertTiming = '1hour' | '30min' | '10min' | '5min';
export type RiskAlertTiming = '12hours' | '6hours' | '1hour';
export type VolumeLevel = 'mute' | 'low' | 'medium' | 'high';

export interface TimerSettings {
  showFloatingTimer: boolean;
  timerPosition: TimerPosition;
  timerSize: TimerSize;
  timerOpacity: number;
  questDeadlineAlerts: boolean;
  alertTiming: AlertTiming;
  dailyCheckInReminder: boolean;
  preferredTime: string;
  streakMaintenanceAlert: boolean;
  riskAlertTiming: RiskAlertTiming;
  timerFormat: TimerFormat;
  soundNotifications: boolean;
  volumeLevel: VolumeLevel;
  statusBarIcon: boolean;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  xp: number;
  questsCompleted: number;
  isRestored: boolean;
}

export interface CalendarData {
  activities: DayActivity[];
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  restoresRemaining: number;
  restoresResetDate: string;
}

export interface TimerState {
  questId: string | null;
  questName: string;
  timeRemaining: number; // seconds
  deadline: string | null;
  isActive: boolean;
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  showFloatingTimer: true,
  timerPosition: 'top-right',
  timerSize: 'medium',
  timerOpacity: 100,
  questDeadlineAlerts: true,
  alertTiming: '5min',
  dailyCheckInReminder: true,
  preferredTime: '09:00',
  streakMaintenanceAlert: true,
  riskAlertTiming: '6hours',
  timerFormat: 'remaining',
  soundNotifications: true,
  volumeLevel: 'medium',
  statusBarIcon: true,
};

export const TIMER_SIZE_MAP: Record<TimerSize, number> = {
  small: 240,
  medium: 280,
  large: 320,
};

export const POSITION_CLASSES: Record<TimerPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-20 left-4',
  'bottom-right': 'bottom-20 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
};
