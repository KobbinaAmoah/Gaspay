import React from 'react';
import { GasPumpIcon, MtnIcon, VodafoneIcon, AirtelTigoIcon, GhanaQrIcon } from './icons/Icons';

interface PaymentScreenProps {
  transaction: {
    station: string;
    amount: number;
  };
  remainingBudget: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ transaction, remainingBudget, onConfirm, onCancel }) => {
  const budgetAfterPayment = remainingBudget - transaction.amount;
  const canAfford = budgetAfterPayment >= 0;

  return (
    <div className="flex flex-col justify-between h-full p-4 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">Confirm Payment</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full">
              <GasPumpIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Paying to</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{transaction.station}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">Amount</p>
            <p className="text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">GH₵{transaction.amount.toFixed(2)}</p>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Supported Payment Methods</p>
            <div className="flex justify-center items-center gap-3">
                <MtnIcon className="h-7 w-auto" />
                <VodafoneIcon className="h-7 w-7" />
                <AirtelTigoIcon className="h-6 w-auto" />
                <GhanaQrIcon className="h-7 w-7" />
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Budget Remaining</span>
              <span>GH₵{remainingBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-200">
              <span>Budget After Payment</span>
              <span className={canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                GH₵{budgetAfterPayment.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        {!canAfford && (
          <div className="mt-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
            <p className="font-bold">Insufficient Budget</p>
            <p>This payment exceeds your remaining budget.</p>
          </div>
        )}
      </div>

      <div className="space-y-3 mt-8">
        <button
          onClick={onConfirm}
          disabled={!canAfford}
          className={`w-full text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            canAfford ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
          }`}
        >
          Confirm & Pay
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-transparent text-gray-600 dark:text-gray-300 font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;