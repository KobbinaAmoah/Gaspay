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
        <div className="space-y-4">
            <RewardItem currentPoints={points.balance} pointsNeeded={100} reward="GH₵10 Fuel Discount" />
            <RewardItem currentPoints={points.balance} pointsNeeded={250} reward="GH₵30 Fuel Discount" />
            <RewardItem currentPoints={points.balance} pointsNeeded={500} reward="Free Car Wash Coupon" />
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

const RewardItem: React.FC<{currentPoints: number; pointsNeeded: number; reward: string;}> = ({ currentPoints, pointsNeeded, reward }) => {
    const progress = Math.min((currentPoints / pointsNeeded) * 100, 100);
    const canRedeem = currentPoints >= pointsNeeded;

    return (
    <div className={`p-4 rounded-xl ${canRedeem ? 'bg-green-50 dark:bg-green-900/50' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
        <div className="flex justify-between items-center mb-2">
            <div>
                <p className={`font-semibold ${canRedeem ? 'text-green-800 dark:text-green-300' : 'text-gray-700 dark:text-gray-400'}`}>{reward}</p>
                <p className={`text-sm ${canRedeem ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'}`}>
                    <span className="font-bold">{pointsNeeded}</span> points
                </p>
            </div>
            <button disabled={!canRedeem} className="bg-white dark:bg-gray-700 text-sm font-semibold py-2 px-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300">
                Redeem
            </button>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
                className={`h-2 rounded-full ${canRedeem ? 'bg-green-500' : 'bg-yellow-500'} transition-all duration-500 ease-out`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    </div>
)}

export default RewardsScreen;