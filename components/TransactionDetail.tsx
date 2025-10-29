import React from 'react';
import { Transaction } from '../types';
import { GasPumpIcon, StarIcon } from './icons/Icons';

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-detail-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
            <h2 id="transaction-detail-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">Transaction Details</h2>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full">
                <GasPumpIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paid to</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{transaction.station}</p>
            </div>
        </div>

        <div className="space-y-3 divide-y divide-gray-100 dark:divide-gray-700">
            <DetailRow label="Amount" value={`GH₵${transaction.amount.toFixed(2)}`} isAmount={true} />
            <DetailRow label="Date & Time" value={new Date(transaction.date).toLocaleString()} />
            <DetailRow label="Points Earned" value={`+${transaction.pointsEarned} points`} />
            <DetailRow label="Transaction ID" value={transaction.id.substring(0, 13)} />
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-900 dark:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-gray-800 dark:hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{label: string, value: string, isAmount?: boolean}> = ({label, value, isAmount}) => (
    <div className="flex justify-between items-center pt-3">
        <p className="text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`font-semibold ${isAmount ? 'text-2xl text-gray-800 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{value}</p>
    </div>
)

export default TransactionDetail;