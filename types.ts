export interface Transaction {
  id: string;
  station: string;
  amount: number;
  date: string; // ISO string
  pointsEarned: number;
  odometer?: number;
}

export interface Budget {
  total: number;
  spent: number;
}

export interface Notification {
  id: string;
  message: string;
  date: string; // ISO string
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'reward';
}

export interface User {
  phoneNumber: string;
}

export interface FuelSavingTip {
  tip: string;
  explanation: string;
}

export interface GasStation {
    id: string;
    name: string;
    uri?: string;
    title?: string;
}

export interface RewardPointHistory {
    transactionId: string;
    date: string; // ISO string
    points: number;
}

export interface RewardPoints {
    balance: number;
    history: RewardPointHistory[];
}

export interface PaymentMethod {
    id: string;
    provider: 'MTN' | 'Vodafone' | 'AirtelTigo';
    phoneNumber: string;
    isPrimary: boolean;
}

export enum Screen {
  Login,
  Otp,
  Dashboard,
  History,
  Budget,
  Stations,
  Profile,
  Payment,
  Scan,
  PaymentSuccess,
  Notifications,
  TransactionDetail,
  Rewards,
  PaymentMethods,
  Recovery
}

export type Theme = 'light' | 'dark';
