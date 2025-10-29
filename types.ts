export interface Transaction {
  id: string;
  station: string;
  amount: number;
  date: string;
  pointsEarned: number;
}

export interface Budget {
  total: number;
  spent: number;
}

export enum Screen {
  Dashboard = 'DASHBOARD',
  History = 'HISTORY',
  Budget = 'BUDGET',
  Payment = 'PAYMENT',
  Profile = 'PROFILE',
  Stations = 'STATIONS',
  Notifications = 'NOTIFICATIONS',
  Rewards = 'REWARDS',
}

export interface FuelSavingTip {
    tip: string;
    explanation: string;
}

export interface User {
  phoneNumber: string;
}

export interface GasStation {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
}

export interface Notification {
    id: string;
    message: string;
    date: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'reward';
}

export interface RewardPoints {
    balance: number;
    history: {
        transactionId: string;
        points: number;
        date: string;
    }[];
}

export type Theme = 'light' | 'dark';