import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Transaction, Budget, User, Notification, RewardPoints, PaymentMethod, Theme } from './types';
import { api } from './services/api';

import BottomNavBar from './components/BottomNavBar';
import Dashboard from './components/Dashboard';
import HistoryScreen from './components/HistoryScreen';
import BudgetScreen from './components/BudgetScreen';
import ProfileScreen from './components/ProfileScreen';
import StationsScreen from './components/StationsScreen';
import LoginScreen from './components/LoginScreen';
import OtpScreen from './components/OtpScreen';
import ScanScreen from './components/ScanScreen';
import PaymentScreen from './components/PaymentScreen';
import PaymentSuccessScreen from './components/PaymentSuccessScreen';
import NotificationsScreen from './components/NotificationsScreen';
import TransactionDetail from './components/TransactionDetail';
import RewardsScreen from './components/RewardsScreen';
import PaymentMethodsScreen from './components/PaymentMethodsScreen';
import RecoveryScreen from './components/RecoveryScreen';
import BiometricPrompt from './components/BiometricPrompt';
// Fix: Import AppLogoIcon
import { AppLogoIcon } from './components/icons/Icons';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>(Screen.Login);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  
  // App Data State
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget>({ total: 0, spent: 0 });
  const [points, setPoints] = useState<RewardPoints>({balance: 0, history: []});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricPromptVisible, setIsBiometricPromptVisible] = useState(false);


  // Temporary state for flows
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [pendingPayment, setPendingPayment] = useState<{ station: string; amount: number } | null>(null);
  const [loginPhoneNumber, setLoginPhoneNumber] = useState('');
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const loadAppData = useCallback(async () => {
    // In a real app, you might use Promise.all
    setUser(await api.getUser());
    setTransactions(await api.getTransactions());
    setBudget(await api.getBudget());
    setPoints(await api.getRewardPoints());
    setNotifications(await api.getNotifications());
    setPaymentMethods(await api.getPaymentMethods());
  }, []);

  useEffect(() => {
    // On initial load, check stored settings
    const storedAuth = api.isAuthenticated();
    const biometricEnabled = api.isBiometricEnabledSync();
    
    setIsBiometricEnabled(biometricEnabled);
    
    if (storedAuth) {
      setIsAuthenticated(true);
    } else if (biometricEnabled) {
      // If not logged in but biometrics are on, show the prompt
      setIsBiometricPromptVisible(true);
    }
    setIsAppLoading(false);
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadAppData();
      api.setAuthenticated(true);
      setScreen(Screen.Dashboard);
    } else {
      api.setAuthenticated(false);
      setScreen(Screen.Login);
    }
  }, [isAuthenticated, loadAppData]);
  
  // --- Navigation and Flow Handlers ---
  
  const handleLoginRequest = async (phoneNumber: string) => {
    setLoginPhoneNumber(phoneNumber);
    const success = await api.loginRequest(phoneNumber);
    if (success) {
      setScreen(Screen.Otp);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    const success = await api.verifyOtp(otp);
    if (success) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };
  
  const handleScanSuccess = (data: { station: string; amount: number }) => {
    setPendingPayment(data);
    setScreen(Screen.Payment);
  };
  
  const handlePaymentConfirm = async () => {
    if (pendingPayment) {
      const newTransaction = await api.addTransaction(pendingPayment);
      setActiveTransaction(newTransaction);
      setPendingPayment(null);
      setScreen(Screen.PaymentSuccess);
      // Refresh data after payment
      loadAppData();
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleUpdateOdometer = async (transactionId: string, odometer: number) => {
      const updatedTransactions = await api.updateOdometerReading(transactionId, odometer);
      setTransactions(updatedTransactions);
  };

  const handleUpdateBudget = async (newTotal: number) => {
    const updatedBudget = await api.updateBudget(newTotal);
    setBudget(updatedBudget);
    // Optionally, navigate back to dashboard or show a success message
    setScreen(Screen.Dashboard);
  };

  const handleMarkNotificationsRead = useCallback(async () => {
      const updatedNotifications = await api.markNotificationsAsRead();
      setNotifications(updatedNotifications);
  }, []);

  const handleDeleteAccount = () => {
    api.clearAllData();
    setIsAuthenticated(false);
    window.location.reload();
  };

  const handleAddMethod = async (method: Omit<PaymentMethod, 'id' | 'isPrimary'>) => {
      const updatedMethods = await api.addPaymentMethod(method);
      setPaymentMethods(updatedMethods);
  };
  const handleRemoveMethod = async (methodId: string) => {
      const updatedMethods = await api.removePaymentMethod(methodId);
      setPaymentMethods(updatedMethods);
  };
  const handleSetPrimary = async (methodId: string) => {
      const updatedMethods = await api.setPrimaryPaymentMethod(methodId);
      setPaymentMethods(updatedMethods);
  };

  const handleSetBiometricEnabled = async (enabled: boolean) => {
    await api.setBiometricEnabled(enabled);
    setIsBiometricEnabled(enabled);
  };

  const handleBiometricLogin = async () => {
    const success = await api.biometricLogin();
    if (success) {
      setIsAuthenticated(true);
      setIsBiometricPromptVisible(false);
    } else {
      alert("Biometric login failed.");
      setIsBiometricPromptVisible(false);
    }
  };
  
  
  // --- Screen Rendering ---
  
  const renderScreen = () => {
    if (isAppLoading) {
        return <div className="flex items-center justify-center h-screen"><AppLogoIcon className="w-20 h-20 animate-pulse" /></div>;
    }
    // Fullscreen flows that don't need the nav bar
    if (!isAuthenticated) {
      switch(screen) {
        case Screen.Login:
          return <LoginScreen onLoginRequest={handleLoginRequest} onNavigateToRecovery={() => setScreen(Screen.Recovery)} isBiometricEnabled={isBiometricEnabled} onBiometricLogin={() => setIsBiometricPromptVisible(true)} />;
        case Screen.Otp:
          return <OtpScreen phoneNumber={loginPhoneNumber} onVerify={handleOtpVerify} onGoBack={() => setScreen(Screen.Login)} onResend={() => alert("Resent code (mock)")}/>;
        case Screen.Recovery:
            return <RecoveryScreen onNavigateToLogin={() => setScreen(Screen.Login)} />;
        default:
          return <LoginScreen onLoginRequest={handleLoginRequest} onNavigateToRecovery={() => setScreen(Screen.Recovery)} isBiometricEnabled={isBiometricEnabled} onBiometricLogin={() => setIsBiometricPromptVisible(true)} />;
      }
    }
    
    if (screen === Screen.Scan) {
      return <ScanScreen onScanSuccess={handleScanSuccess} onCancel={() => setScreen(Screen.Dashboard)} />;
    }
    if (screen === Screen.Payment && pendingPayment) {
      return <PaymentScreen 
        transaction={pendingPayment} 
        remainingBudget={budget.total - budget.spent}
        onConfirm={handlePaymentConfirm} 
        onCancel={() => setScreen(Screen.Dashboard)} 
      />;
    }
     if (screen === Screen.PaymentSuccess && activeTransaction) {
      return <PaymentSuccessScreen 
        transaction={activeTransaction} 
        budget={{...budget, spent: budget.spent + activeTransaction.amount}}
        onClose={() => {
            setActiveTransaction(null);
            setScreen(Screen.Dashboard);
        }}
        onUpdateOdometer={handleUpdateOdometer}
      />;
    }
    if (activeTransaction && screen === Screen.TransactionDetail) {
        return <TransactionDetail transaction={activeTransaction} transactions={transactions} onClose={() => setActiveTransaction(null)} />;
    }

    // Screens with nav bar
    let currentScreenComponent;
    switch (screen) {
      case Screen.Dashboard:
        currentScreenComponent = <Dashboard budget={budget} transactions={transactions} points={points.balance} notifications={notifications} onScan={() => setScreen(Screen.Scan)} setScreen={setScreen} />;
        break;
      case Screen.History:
        currentScreenComponent = <HistoryScreen transactions={transactions} onViewTransaction={(tx) => { setActiveTransaction(tx); setScreen(Screen.TransactionDetail) }} />;
        break;
      case Screen.Budget:
        currentScreenComponent = <BudgetScreen budget={budget} onUpdateBudget={handleUpdateBudget} />;
        break;
      case Screen.Stations:
        currentScreenComponent = <StationsScreen />;
        break;
      case Screen.Profile:
        currentScreenComponent = user && <ProfileScreen user={user} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} setScreen={setScreen} theme={theme} toggleTheme={toggleTheme} isBiometricEnabled={isBiometricEnabled} onSetBiometricEnabled={handleSetBiometricEnabled} />;
        break;
      case Screen.Notifications:
        currentScreenComponent = <NotificationsScreen notifications={notifications} onMarkAsRead={handleMarkNotificationsRead} />;
        break;
      case Screen.Rewards:
        currentScreenComponent = <RewardsScreen points={points} />;
        break;
      case Screen.PaymentMethods:
        currentScreenComponent = <PaymentMethodsScreen methods={paymentMethods} onAddMethod={handleAddMethod} onRemoveMethod={handleRemoveMethod} onSetPrimary={handleSetPrimary} />;
        break;
      default:
        currentScreenComponent = <Dashboard budget={budget} transactions={transactions} points={points.balance} notifications={notifications} onScan={() => setScreen(Screen.Scan)} setScreen={setScreen} />;
    }
    
    return (
      <div className="pb-24">
        {currentScreenComponent}
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-950 min-h-screen shadow-2xl relative">
      <main className="p-4">
        {renderScreen()}
      </main>
      {isAuthenticated && <BottomNavBar activeScreen={screen} setScreen={setScreen} />}
       {isBiometricPromptVisible && !isAuthenticated && (
        <BiometricPrompt
          onSuccess={handleBiometricLogin}
          onCancel={() => setIsBiometricPromptVisible(false)}
        />
      )}
    </div>
  );
}

export default App;
