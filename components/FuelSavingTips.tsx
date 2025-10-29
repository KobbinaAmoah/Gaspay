import React, { useState, useCallback, useEffect } from 'react';
import { Transaction, FuelSavingTip } from '../types';
import { getFuelSavingTips } from '../services/geminiService';
import { LightbulbIcon } from './icons/Icons';

interface FuelSavingTipsProps {
  transactions: Transaction[];
}

const FuelSavingTips: React.FC<FuelSavingTipsProps> = ({ transactions }) => {
  const [tips, setTips] = useState<FuelSavingTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTips = await getFuelSavingTips(transactions);
      setTips(fetchedTips);
    } catch (err) {
      setError('Failed to fetch tips. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">AI Fuel Assistant</h2>
      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
                <div className="flex-1 space-y-3 py-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tips.length > 0 ? (
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full mt-1">
                    <LightbulbIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400"/>
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{tip.tip}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tip.explanation}</p>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Click the button to get personalized tips based on your spending.</p>
      )}

      <button
        onClick={fetchTips}
        disabled={loading}
        className="w-full mt-4 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? 'Analyzing...' : 'Get New Tips'}
      </button>
    </div>
  );
};

export default FuelSavingTips;