import React, { useState } from 'react';
import { Budget } from '../types';

interface BudgetScreenProps {
  budget: Budget;
  onUpdateBudget: (newTotal: number) => void;
}

const BudgetScreen: React.FC<BudgetScreenProps> = ({ budget, onUpdateBudget }) => {
  const [newTotal, setNewTotal] = useState(budget.total.toString());
  const remaining = budget.total - budget.spent;
  const percentageSpent = (budget.spent / budget.total) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudgetValue = parseFloat(newTotal);
    if (!isNaN(newBudgetValue) && newBudgetValue > 0) {
      onUpdateBudget(newBudgetValue);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">Manage Your Budget</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
        <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">Current Budget</h2>
        <p className="text-5xl font-bold text-gray-900 dark:text-gray-100 my-2">GH₵{budget.total.toFixed(2)}</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 my-4">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full"
            style={{ width: `${100 - percentageSpent}%` }}
          ></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold">GH₵{remaining.toFixed(2)}</span> remaining of <span className="font-semibold">GH₵{budget.spent.toFixed(2)}</span> spent</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Update Subscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Monthly Amount</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">GH₵</span>
              </div>
              <input
                type="number"
                name="budget"
                id="budget"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 rounded-md py-3"
                placeholder="0.00"
                value={newTotal}
                onChange={(e) => setNewTotal(e.target.value)}
                step="10"
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 dark:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-gray-800 dark:hover:bg-blue-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600"
          >
            Set New Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetScreen;