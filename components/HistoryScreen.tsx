import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { GasPumpIcon, SearchIcon, StarIcon } from './icons/Icons';

interface HistoryScreenProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ transactions, onViewTransaction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = transactions.filter(tx =>
      tx.station.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Transaction History</h1>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search by station..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          aria-label="Search transactions by station name"
        />
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div 
              key={tx.id} 
              className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md dark:hover:bg-gray-700/50 transition-shadow cursor-pointer"
              onClick={() => onViewTransaction(tx)}
              role="button"
              aria-label={`View details for transaction at ${tx.station}`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-full">
                  <GasPumpIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{tx.station}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(tx.date).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-red-500 dark:text-red-400">-GH₵{tx.amount.toFixed(2)}</p>
                <div className="flex items-center justify-end gap-1 text-yellow-500 dark:text-yellow-400">
                    <StarIcon className="w-3 h-3"/>
                    <p className="text-xs font-bold">+{tx.pointsEarned}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;