import React from 'react';
import { RewardPoints } from '../types';
import { StarIcon, GasPumpIcon } from './icons/Icons';

interface RewardsScreenProps {
  points: RewardPoints;
}

const RewardsScreen: React.FC<RewardsScreenProps> = ({ points }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">My Rewards</h1>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white text-center">
        <h2 className="text-lg font-medium opacity-80">Your Points Balance</h2>
        <div className="flex items-center justify-center gap-2 my-2">
            <StarIcon className="w-10 h-10"/>
            <p className="text-6xl font-bold">{points.balance}</p>
        </div>
        <p className="opacity-90">Keep spending to earn more!</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Redeem Points</h2>
        <div className="space-y-3">
            <RewardItem pointsNeeded={100} reward="GH₵10 Fuel Discount" disabled={points.balance < 100} />
            <RewardItem pointsNeeded={250} reward="GH₵30 Fuel Discount" disabled={points.balance < 250} />
            <RewardItem pointsNeeded={500} reward="Free Car Wash Coupon" disabled={points.balance < 500} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Points History</h2>
        <div className="space-y-4 max-h-60 overflow-y-auto">
            {points.history.map(item => (
                <div key={item.transactionId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="bg-gray-100 dark:bg-gray-700/50 p-2 rounded-full">
                            <GasPumpIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">Fuel Purchase</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">+{item.points} pts</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const RewardItem: React.FC<{pointsNeeded: number; reward: string; disabled: boolean}> = ({ pointsNeeded, reward, disabled }) => (
    <div className={`p-4 rounded-xl flex justify-between items-center ${disabled ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/50'}`}>
        <div>
            <p className={`font-semibold ${disabled ? 'text-gray-600 dark:text-gray-400' : 'text-green-800 dark:text-green-300'}`}>{reward}</p>
            <p className={`text-sm ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-green-700 dark:text-green-400'}`}>{pointsNeeded} points</p>
        </div>
        <button disabled={disabled} className="bg-white dark:bg-gray-800 text-sm font-semibold py-2 px-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300">
            Redeem
        </button>
    </div>
)

export default RewardsScreen;