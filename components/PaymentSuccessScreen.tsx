import React, { useEffect } from 'react';
import { Transaction, Budget } from '../types';
import { CheckCircleIcon, StarIcon } from './icons/Icons';

interface PaymentSuccessScreenProps {
  transaction: Transaction;
  budget: Budget;
  onClose: () => void;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ transaction, budget, onClose }) => {
  const remainingBudget = budget.total - budget.spent;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-100 dark:bg-gray-950 text-center animate-fade-in">
      <div className="w-24 h-24 flex items-center justify-center bg-green-100 dark:bg-green-900/50 rounded-full mb-6">
        <CheckCircleIcon className="w-16 h-16 text-green-500 dark:text-green-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Payment Successful!</h1>
      
      <p className="text-6xl font-extrabold text-gray-900 dark:text-gray-100 my-4 tracking-tight">
        GH₵{transaction.amount.toFixed(2)}
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        Paid to <span className="font-semibold text-gray-700 dark:text-gray-300">{transaction.station}</span>
      </p>

      <div className="my-8 w-full max-w-xs space-y-4">
        <div className="flex justify-between text-gray-700 dark:text-gray-300 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <span className="font-medium">Points Earned</span>
          <div className="flex items-center gap-1 font-bold text-yellow-500 dark:text-yellow-400">
            <StarIcon className="w-5 h-5"/>
            <span>+{transaction.pointsEarned}</span>
          </div>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-gray-300 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <span className="font-medium">New Budget Remaining</span>
          <span className="font-bold text-gray-800 dark:text-gray-200">GH₵{remainingBudget.toFixed(2)}</span>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="w-full max-w-xs bg-gray-900 dark:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-gray-800 dark:hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600"
      >
        Done
      </button>
    </div>
  );
};

export default PaymentSuccessScreen;