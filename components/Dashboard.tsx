import React from 'react';
import { Transaction, Budget, Screen, Notification } from '../types';
import { QrCodeIcon, GasPumpIcon, WarningIcon, BellIcon, StarIcon, GaugeIcon } from './icons/Icons';
import FuelSavingTips from './FuelSavingTips';

interface DashboardProps {
  budget: Budget;
  transactions: Transaction[];
  points: number;
  notifications: Notification[];
  onScan: () => void;
  setScreen: (screen: Screen) => void;
}

const calculateEfficiency = (transactions: Transaction[]) => {
    const sortedTx = [...transactions]
      .filter(tx => tx.odometer !== undefined && tx.odometer > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if(sortedTx.length < 2) return null;

    const latestTx = sortedTx[sortedTx.length - 1];
    const previousTx = sortedTx[sortedTx.length - 2];

    if (latestTx.odometer! > previousTx.odometer!) {
        const distance = latestTx.odometer! - previousTx.odometer!;
        const costPerKm = latestTx.amount / distance;
        return { costPerKm };
    }
    return null;
}

const Dashboard: React.FC<DashboardProps> = ({ budget, transactions, onScan, points, setScreen, notifications }) => {
  const remaining = budget.total - budget.spent;
  const percentageSpent = (budget.total > 0 ? budget.spent / budget.total : 0) * 100;
  const isLowBudget = budget.total > 0 && (remaining / budget.total) < 0.15;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const efficiency = calculateEfficiency(transactions);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome Back!</h1>
          <p className="text-gray-500 dark:text-gray-400">Your monthly fuel summary</p>
        </div>
        <button onClick={() => setScreen(Screen.Notifications)} className="relative p-2" aria-label="View notifications">
          <BellIcon className="w-7 h-7 text-gray-600 dark:text-gray-400" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-gray-100 dark:border-gray-950"></span>
          )}
        </button>
      </header>

      {isLowBudget && (
        <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg flex items-center gap-3 shadow-md animate-pulse">
          <WarningIcon className="w-8 h-8 flex-shrink-0" />
          <div>
            <p className="font-bold">Low Budget Alert!</p>
            <p className="text-sm">You've used over 85% of your budget. Consider topping up.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 text-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</span>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">GH₵{remaining.toFixed(2)}</p>
        </div>
         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 text-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Loyalty Points</span>
          <div className="flex items-center justify-center gap-1">
             <StarIcon className="w-7 h-7 text-yellow-400 -ml-2" />
             <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{points}</p>
          </div>
        </div>
      </div>
      
      {efficiency && (
         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 text-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Efficiency</span>
            <div className="flex items-center justify-center gap-2">
               <GaugeIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
               <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    GH₵{efficiency.costPerKm.toFixed(2)}
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400"> / km</span>
                </p>
            </div>
          </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-3">
         <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
          <span>Spent: GH₵{budget.spent.toFixed(2)}</span>
          <span>Total: GH₵{budget.total.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentageSpent}%` }}
          ></div>
        </div>
      </div>

      <button
        onClick={onScan}
        className="w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:bg-gray-800 dark:hover:bg-blue-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600"
      >
        <QrCodeIcon className="w-6 h-6" />
        <span>Scan QR to Pay</span>
      </button>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 -mt-4">
        Supports Mobile Money & Ghana QR
      </p>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.slice(0, 3).map((tx) => (
            <div key={tx.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                  <GasPumpIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{tx.station}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="font-bold text-gray-900 dark:text-gray-100">-GH₵{tx.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      
      <FuelSavingTips transactions={transactions} />

    </div>
  );
};

export default Dashboard;