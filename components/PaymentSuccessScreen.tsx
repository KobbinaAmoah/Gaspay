import React, { useEffect, useState } from 'react';
import { Transaction, Budget } from '../types';
import { CheckCircleIcon, StarIcon, GaugeIcon } from './icons/Icons';

interface PaymentSuccessScreenProps {
  transaction: Transaction;
  budget: Budget;
  onClose: () => void;
  onUpdateOdometer: (transactionId: string, odometer: number) => void;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ transaction, budget, onClose, onUpdateOdometer }) => {
  const remainingBudget = budget.total - budget.spent;
  const [odometer, setOdometer] = useState('');
  const [odometerSubmitted, setOdometerSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!odometerSubmitted) { // Auto-close only if odometer was not being entered
        onClose();
      }
    }, 5000); 

    return () => clearTimeout(timer);
  }, [onClose, odometerSubmitted]);

  const handleOdometerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reading = parseInt(odometer, 10);
    if (!isNaN(reading) && reading > 0) {
      onUpdateOdometer(transaction.id, reading);
      setOdometerSubmitted(true);
      // Close after a short delay to show confirmation
      setTimeout(onClose, 1500);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-100 dark:bg-gray-950 text-center animate-fade-in">
      <div className="w-24 h-24 flex items-center justify-center bg-green-100 dark:bg-green-900/50 rounded-full mb-6">
        <CheckCircleIcon className="w-16 h-16 text-green-500 dark:text-green-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Payment Successful!</h1>
      
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        <span className="font-semibold text-gray-700 dark:text-gray-300">GH₵{transaction.amount.toFixed(2)}</span> paid to <span className="font-semibold text-gray-700 dark:text-gray-300">{transaction.station}</span>
      </p>

      <div className="my-6 w-full max-w-xs space-y-3">
        <div className="flex justify-between text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <span className="font-medium">Points Earned</span>
          <div className="flex items-center gap-1 font-bold text-yellow-500 dark:text-yellow-400">
            <StarIcon className="w-5 h-5"/>
            <span>+{transaction.pointsEarned}</span>
          </div>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <span className="font-medium">New Budget Remaining</span>
          <span className="font-bold text-gray-800 dark:text-gray-200">GH₵{remainingBudget.toFixed(2)}</span>
        </div>
      </div>
      
      { odometerSubmitted ? (
        <p className="text-green-600 dark:text-green-400 font-semibold">Odometer reading saved!</p>
      ) : (
        <form onSubmit={handleOdometerSubmit} className="w-full max-w-xs space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <label htmlFor="odometer" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <GaugeIcon className="w-5 h-5" />
                Add Odometer (Optional)
            </label>
            <input
                id="odometer"
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                placeholder="e.g., 50150 km"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
                type="submit"
                className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:opacity-50"
                disabled={!odometer}
            >
                Save Reading
            </button>
        </form>
      )}

      <button
        onClick={onClose}
        className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:underline"
      >
        Skip
      </button>
    </div>
  );
};

export default PaymentSuccessScreen;