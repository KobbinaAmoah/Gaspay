import React, { useState, useCallback, useEffect } from 'react';
import { Transaction, Screen, Budget, User, Notification, GasStation, RewardPoints, Theme, PaymentMethod } from './types';
import Dashboard from './components/Dashboard';
import HistoryScreen from './components/HistoryScreen';
import BudgetScreen from './components/BudgetScreen';
import BottomNavBar from './components/BottomNavBar';
import PaymentScreen from './components/PaymentScreen';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import StationsScreen from './components/StationsScreen';
import NotificationsScreen from './components/NotificationsScreen';
import RewardsScreen from './components/RewardsScreen';
import TransactionDetail from './components/TransactionDetail';
import RecoveryScreen from './components/RecoveryScreen';
import PaymentMethodsScreen from './components/PaymentMethodsScreen';
import ScanScreen from './components/ScanScreen';
import PaymentSuccessScreen from './components/PaymentSuccessScreen';
import OtpScreen from './components/OtpScreen';

// Mock Data
const mockStations: GasStation[] = [
  { id: '1', name: 'Goil Osu', location: { lat: 5.556, lng: -0.183 } },
  { id: '2', name: 'Shell Airport', location: { lat: 5.603, lng: -0.180 } },
  { id: '3', name: 'Total East Legon', location: { lat: 5.637, lng: -0.166 } },
  { id: '4', name: 'Allied Oil Madina', location: { lat: 5.679, lng: -0.169 } },
];

const initialTransactions: Transaction[] = [
  { id: '1', station: 'Goil Osu', amount: 45.50, date: '2023-10-26T10:00:00Z', pointsEarned: 4 },
  { id: '2', station: 'Shell Airport', amount: 50.00, date: '2023-10-20T15:30:00Z', pointsEarned: 5 },
  { id: '3', station: 'Total East Legon', amount: 30.00, date: '2023-10-12T08:45:00Z', pointsEarned: 3 },
];

const initialBudget: Budget = {
  total: 300,
  spent: 125.50,
};

const initialPoints: RewardPoints = {
    balance: 12,
    history: [
      { transactionId: '1', points: 4, date: '2023-10-26T10:00:00Z' },
      { transactionId: '2', points: 5, date: '2023-10-20T15:30:00Z' },
      { transactionId: '3', points: 3, date: '2023-10-12T08:45:00Z' },
    ]
};

const initialNotifications: Notification[] = [
    { id: '1', message: 'Welcome to GasPay! Manage your fuel budget with ease.', date: new Date().toISOString(), read: false, type: 'info' },
];

const initialPaymentMethods: PaymentMethod[] = [
    { id: 'pm_1', provider: 'MTN', phoneNumber: '024 123 4567', isPrimary: true },
];


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'otp' | 'recovery'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loginPhoneNumber, setLoginPhoneNumber] = useState<string>('');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const [screen, setScreen] = useState<Screen>(Screen.Dashboard);
  const [budget, setBudget] = useState<Budget>(initialBudget);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [pendingTransaction, setPendingTransaction] = useState<{ station: string; amount: number } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  
  const [points, setPoints] = useState<RewardPoints>(initialPoints);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);

  useEffect(() => {
    if (screen === Screen.Payment && !pendingTransaction) {
      console.warn("Attempted to render Payment screen without a pending transaction. Redirecting to dashboard.");
      setScreen(Screen.Dashboard);
    }
    if (screen === Screen.PaymentSuccess && !lastTransaction) {
        console.warn("Attempted to render PaymentSuccess screen without a last transaction. Redirecting to dashboard.");
        setScreen(Screen.Dashboard);
    }
  }, [screen, pendingTransaction, lastTransaction]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const newNotification: Notification = {
      id: new Date().toISOString(),
      message,
      date: new Date().toISOString(),
      read: false,
      type,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const handleLoginRequest = useCallback((phoneNumber: string) => {
    setLoginPhoneNumber(phoneNumber);
    setAuthScreen('otp');
  }, []);
  
  const handleOtpVerification = useCallback((otp: string) => {
      // In a real app, you'd verify the OTP against a backend service.
      // Here, we'll just check against a mock OTP.
      if (otp === '1234') {
        setUser({ phoneNumber: loginPhoneNumber });
        setIsAuthenticated(true);
        setScreen(Screen.Dashboard);
        addNotification('Successfully signed in.');
        return true;
      }
      return false;
  }, [loginPhoneNumber, addNotification]);


  const handleLogout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthScreen('login');
  }, []);
  
  const handleDeleteAccount = useCallback(() => {
    // Reset all state to initial values
    setBudget(initialBudget);
    setTransactions(initialTransactions);
    setPoints(initialPoints);
    setNotifications(initialNotifications);
    setPaymentMethods(initialPaymentMethods);
    
    // Log the user out
    handleLogout();
  }, [handleLogout]);

  const handleScan = useCallback(() => {
    setScreen(Screen.Scan);
  }, []);

  const handleScanSuccess = useCallback((scannedData: { station: string; amount: number }) => {
    setPendingTransaction(scannedData);
    setScreen(Screen.Payment);
  }, []);

  const handleScanCancel = useCallback(() => {
    setScreen(Screen.Dashboard);
  }, []);


  const handlePaymentConfirm = useCallback(() => {
    if (pendingTransaction) {
      const pointsEarned = Math.floor(pendingTransaction.amount / 10);
      const newTransaction: Transaction = {
        id: new Date().toISOString(),
        ...pendingTransaction,
        date: new Date().toISOString(),
        pointsEarned,
      };
      
      setBudget(prevBudget => ({
        ...prevBudget,
        spent: prevBudget.spent + newTransaction.amount,
      }));
      
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      
      setPoints(prevPoints => ({
        balance: prevPoints.balance + pointsEarned,
        history: [{ transactionId: newTransaction.id, points: pointsEarned, date: newTransaction.date }, ...prevPoints.history]
      }));

      addNotification(`Payment of GH₵${newTransaction.amount.toFixed(2)} to ${newTransaction.station} was successful.`, 'success');
      addNotification(`You earned ${pointsEarned} points!`, 'reward');

      setLastTransaction(newTransaction);
      setPendingTransaction(null);
      setScreen(Screen.PaymentSuccess);
    }
  }, [pendingTransaction, addNotification]);

  const handlePaymentCancel = useCallback(() => {
    setPendingTransaction(null);
    setScreen(Screen.Dashboard);
  }, []);

  const handlePaymentSuccessClose = useCallback(() => {
    setScreen(Screen.Dashboard);
    setLastTransaction(null);
  }, []);

  const handleBudgetUpdate = useCallback((newTotal: number) => {
    setBudget(prev => ({ ...prev, total: newTotal }));
    addNotification(`Your monthly budget has been updated to GH₵${newTotal.toFixed(2)}.`, 'info');
    setScreen(Screen.Dashboard);
  }, [addNotification]);

  const handleViewTransaction = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
  }, []);

  const handleCloseTransactionDetail = useCallback(() => {
    setSelectedTransaction(null);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleAddPaymentMethod = useCallback((method: Omit<PaymentMethod, 'id' | 'isPrimary'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm_${new Date().getTime()}`,
      isPrimary: paymentMethods.length === 0, // Make primary if it's the first one
    };
    setPaymentMethods(prev => [...prev, newMethod]);
    addNotification(`${method.provider} number ${method.phoneNumber} added successfully.`, 'success');
  }, [paymentMethods.length, addNotification]);

  const handleRemovePaymentMethod = useCallback((methodId: string) => {
    setPaymentMethods(prev => {
      const methodToRemove = prev.find(pm => pm.id === methodId);
      const remaining = prev.filter(pm => pm.id !== methodId);
      
      if (methodToRemove?.isPrimary && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isPrimary: true };
      }
      
      return remaining;
    });
    addNotification(`Payment method removed.`, 'info');
  }, [addNotification]);

  const handleSetPrimaryPaymentMethod = useCallback((methodId: string) => {
    let newPrimaryMethod: PaymentMethod | undefined;
    const updatedMethods = paymentMethods.map(pm => {
        const isNewPrimary = pm.id === methodId;
        if (isNewPrimary) {
            newPrimaryMethod = pm;
        }
        return { ...pm, isPrimary: isNewPrimary };
    });

    setPaymentMethods(updatedMethods);
    if (newPrimaryMethod) {
        addNotification(`${newPrimaryMethod.provider} (${newPrimaryMethod.phoneNumber}) is now your primary payment method.`, 'success');
    }
  }, [paymentMethods, addNotification]);


  const renderScreen = () => {
    switch (screen) {
      case Screen.Dashboard:
        return <Dashboard budget={budget} transactions={transactions} onScan={handleScan} points={points.balance} setScreen={setScreen} notifications={notifications} />;
      case Screen.History:
        return <HistoryScreen transactions={transactions} onViewTransaction={handleViewTransaction} />;
      case Screen.Budget:
        return <BudgetScreen budget={budget} onUpdateBudget={handleBudgetUpdate} />;
      case Screen.Profile:
        return <ProfileScreen user={user!} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} setScreen={setScreen} theme={theme} toggleTheme={toggleTheme} />;
      case Screen.Stations:
        return <StationsScreen stations={mockStations} />;
      case Screen.Notifications:
        return <NotificationsScreen notifications={notifications} onMarkAsRead={markNotificationsAsRead} />;
       case Screen.Rewards:
        return <RewardsScreen points={points} />;
      case Screen.PaymentMethods:
        return <PaymentMethodsScreen methods={paymentMethods} onAddMethod={handleAddPaymentMethod} onRemoveMethod={handleRemovePaymentMethod} onSetPrimary={handleSetPrimaryPaymentMethod} />;
      case Screen.Scan:
        return <ScanScreen onScanSuccess={handleScanSuccess} onCancel={handleScanCancel} />;
      case Screen.Payment:
        if (pendingTransaction) {
          return <PaymentScreen transaction={pendingTransaction} onConfirm={handlePaymentConfirm} onCancel={handlePaymentCancel} remainingBudget={budget.total - budget.spent} />;
        }
        return null; // Return null, the useEffect will handle the redirect.
      case Screen.PaymentSuccess:
        if (lastTransaction) {
          return <PaymentSuccessScreen transaction={lastTransaction} budget={budget} onClose={handlePaymentSuccessClose} />;
        }
        return null; // Return null, the useEffect will handle the redirect.
      default:
        return <Dashboard budget={budget} transactions={transactions} onScan={handleScan} points={points.balance} setScreen={setScreen} notifications={notifications} />;
    }
  };

  const renderAuthScreens = () => {
    switch (authScreen) {
      case 'login':
        return <LoginScreen onLoginRequest={handleLoginRequest} onNavigateToRecovery={() => setAuthScreen('recovery')} />;
      case 'otp':
        return <OtpScreen phoneNumber={loginPhoneNumber} onVerify={handleOtpVerification} onNavigateToLogin={() => setAuthScreen('login')} />;
      case 'recovery':
        return <RecoveryScreen onNavigateToLogin={() => setAuthScreen('login')} />;
      default:
        return <LoginScreen onLoginRequest={handleLoginRequest} onNavigateToRecovery={() => setAuthScreen('recovery')} />;
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-900 dark:bg-black font-sans">
      <div className="w-full max-w-md bg-gray-100 dark:bg-gray-950 shadow-2xl flex flex-col" style={{ height: '100vh' }}>
        {!isAuthenticated ? (
          renderAuthScreens()
        ) : (
          <>
            <main className="flex-grow overflow-y-auto p-4 pb-24">
              {renderScreen()}
            </main>
            {screen !== Screen.Payment && screen !== Screen.Scan && screen !== Screen.PaymentSuccess && (
              <BottomNavBar activeScreen={screen} setScreen={setScreen} />
            )}
            {selectedTransaction && (
              <TransactionDetail transaction={selectedTransaction} onClose={handleCloseTransactionDetail} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;