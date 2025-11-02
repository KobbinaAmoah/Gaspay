import { Transaction, Budget, User, Notification, RewardPoints, PaymentMethod } from '../types';

// MOCK DATA
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', station: 'Goil Adenta', amount: 50.00, date: new Date(Date.now() - 86400000 * 2).toISOString(), pointsEarned: 5, odometer: 50000 },
  { id: 'tx2', station: 'Shell East Legon', amount: 75.50, date: new Date(Date.now() - 86400000 * 5).toISOString(), pointsEarned: 8, odometer: 49750 },
  { id: 'tx3', station: 'TotalEnergies Airport', amount: 60.00, date: new Date(Date.now() - 86400000 * 10).toISOString(), pointsEarned: 6, odometer: 49500 },
  { id: 'tx4', station: 'Allied Oil Madina', amount: 45.00, date: new Date(Date.now() - 86400000 * 15).toISOString(), pointsEarned: 4 },
];

const MOCK_BUDGET: Budget = {
  total: 500,
  spent: MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.amount, 0),
};

const MOCK_USER: User = {
  phoneNumber: '024 123 4567'
};

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', message: 'You earned 5 loyalty points from your purchase at Goil Adenta.', date: new Date(Date.now() - 86400000 * 2).toISOString(), read: false, type: 'reward'},
    { id: 'n2', message: 'Your monthly budget has been set to GH₵500.00.', date: new Date(Date.now() - 86400000 * 30).toISOString(), read: true, type: 'info'},
    { id: 'n3', message: 'Welcome to GasPay! Your account is ready.', date: new Date(Date.now() - 86400000 * 31).toISOString(), read: true, type: 'success'},
];

const MOCK_REWARD_POINTS: RewardPoints = {
    balance: 23,
    history: MOCK_TRANSACTIONS.map(tx => ({ transactionId: tx.id, date: tx.date, points: tx.pointsEarned }))
};

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'pm1', provider: 'MTN', phoneNumber: '024 123 4567', isPrimary: true },
    { id: 'pm2', provider: 'Vodafone', phoneNumber: '050 987 6543', isPrimary: false },
];


const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, value: T) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error writing to localStorage key “${key}”:`, error);
    }
};


// API Functions
export const api = {
  isAuthenticated: (): boolean => getFromStorage('isAuthenticated', false),
  setAuthenticated: (status: boolean) => saveToStorage('isAuthenticated', status),

  loginRequest: async (phoneNumber: string): Promise<boolean> => {
    console.log(`Requesting login for ${phoneNumber}`);
    await new Promise(res => setTimeout(res, 1000));
    return true;
  },

  verifyOtp: async (otp: string): Promise<boolean> => {
    console.log(`Verifying OTP ${otp}`);
    await new Promise(res => setTimeout(res, 1000));
    const success = otp === '1234';
    if (success) {
      if (!getFromStorage('transactions', null)) {
        saveToStorage('transactions', MOCK_TRANSACTIONS);
        saveToStorage('budget', MOCK_BUDGET);
        saveToStorage('user', MOCK_USER);
        saveToStorage('notifications', MOCK_NOTIFICATIONS);
        saveToStorage('rewardPoints', MOCK_REWARD_POINTS);
        saveToStorage('paymentMethods', MOCK_PAYMENT_METHODS);
      }
    }
    return success;
  },
  
  verifyActionOtp: async (otp: string): Promise<boolean> => {
    console.log(`Verifying Action OTP ${otp}`);
    await new Promise(res => setTimeout(res, 1000));
    return otp === '1234';
  },

  getUser: async (): Promise<User> => {
    await new Promise(res => setTimeout(res, 100));
    return getFromStorage('user', MOCK_USER);
  },

  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(res => setTimeout(res, 200));
    return getFromStorage('transactions', MOCK_TRANSACTIONS);
  },

  getBudget: async (): Promise<Budget> => {
    await new Promise(res => setTimeout(res, 150));
    return getFromStorage('budget', MOCK_BUDGET);
  },

  getRewardPoints: async (): Promise<RewardPoints> => {
    await new Promise(res => setTimeout(res, 150));
    return getFromStorage('rewardPoints', MOCK_REWARD_POINTS);
  },

  getNotifications: async (): Promise<Notification[]> => {
    await new Promise(res => setTimeout(res, 100));
    return getFromStorage('notifications', MOCK_NOTIFICATIONS);
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await new Promise(res => setTimeout(res, 100));
    return getFromStorage('paymentMethods', MOCK_PAYMENT_METHODS);
  },

  addTransaction: async (payment: { station: string; amount: number }): Promise<Transaction> => {
    await new Promise(res => setTimeout(res, 500));
    const transactions = getFromStorage('transactions', MOCK_TRANSACTIONS);
    const budget = getFromStorage('budget', MOCK_BUDGET);
    const points = getFromStorage('rewardPoints', MOCK_REWARD_POINTS);

    const newTransaction: Transaction = {
      id: `tx${new Date().getTime()}`,
      station: payment.station,
      amount: payment.amount,
      date: new Date().toISOString(),
      pointsEarned: Math.floor(payment.amount / 10),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    const updatedBudget = { ...budget, spent: budget.spent + newTransaction.amount };
    const updatedPoints = {
        ...points,
        balance: points.balance + newTransaction.pointsEarned,
        history: [{ transactionId: newTransaction.id, date: newTransaction.date, points: newTransaction.pointsEarned }, ...points.history]
    };

    saveToStorage('transactions', updatedTransactions);
    saveToStorage('budget', updatedBudget);
    saveToStorage('rewardPoints', updatedPoints);
    
    return newTransaction;
  },

  updateOdometerReading: async (transactionId: string, odometer: number): Promise<Transaction[]> => {
    await new Promise(res => setTimeout(res, 200));
    const transactions = getFromStorage('transactions', MOCK_TRANSACTIONS);
    const updatedTransactions = transactions.map(tx => 
      tx.id === transactionId ? { ...tx, odometer } : tx
    );
    saveToStorage('transactions', updatedTransactions);
    return updatedTransactions;
  },

  updateBudget: async (newTotal: number): Promise<Budget> => {
    await new Promise(res => setTimeout(res, 300));
    const budget = getFromStorage('budget', MOCK_BUDGET);
    const updatedBudget = { ...budget, total: newTotal };
    saveToStorage('budget', updatedBudget);
    return updatedBudget;
  },

  markNotificationsAsRead: async (): Promise<Notification[]> => {
    await new Promise(res => setTimeout(res, 100));
    const notifications = getFromStorage('notifications', MOCK_NOTIFICATIONS);
    const updatedNotifications = notifications.map(n => ({...n, read: true}));
    saveToStorage('notifications', updatedNotifications);
    return updatedNotifications;
  },

  clearAllData: () => {
    window.localStorage.clear();
  },

  addPaymentMethod: async (method: Omit<PaymentMethod, 'id' | 'isPrimary'>): Promise<PaymentMethod[]> => {
    await new Promise(res => setTimeout(res, 300));
    const methods = getFromStorage('paymentMethods', MOCK_PAYMENT_METHODS);
    const newMethod: PaymentMethod = {
        ...method,
        id: `pm${new Date().getTime()}`,
        isPrimary: methods.length === 0,
    };
    const updatedMethods = [...methods, newMethod];
    saveToStorage('paymentMethods', updatedMethods);
    return updatedMethods;
  },

  removePaymentMethod: async (methodId: string): Promise<PaymentMethod[]> => {
    await new Promise(res => setTimeout(res, 300));
    let methods = getFromStorage('paymentMethods', MOCK_PAYMENT_METHODS);
    methods = methods.filter(m => m.id !== methodId);
    if (!methods.some(m => m.isPrimary) && methods.length > 0) {
        methods[0].isPrimary = true;
    }
    saveToStorage('paymentMethods', methods);
    return methods;
  },

  setPrimaryPaymentMethod: async (methodId: string): Promise<PaymentMethod[]> => {
    await new Promise(res => setTimeout(res, 300));
    const methods = getFromStorage('paymentMethods', MOCK_PAYMENT_METHODS);
    const updatedMethods = methods.map(m => ({ ...m, isPrimary: m.id === methodId }));
    saveToStorage('paymentMethods', updatedMethods);
    return updatedMethods;
  },

  isBiometricEnabledSync: (): boolean => getFromStorage('isBiometricEnabled', false),
  setBiometricEnabled: async (enabled: boolean): Promise<void> => {
    await new Promise(res => setTimeout(res, 100));
    saveToStorage('isBiometricEnabled', enabled);
  },

  biometricLogin: async (): Promise<boolean> => {
    await new Promise(res => setTimeout(res, 500));
    return true;
  },
};
