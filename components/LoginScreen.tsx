import React, { useState } from 'react';
import { GasPumpIcon } from './icons/Icons';

interface LoginScreenProps {
  onLogin: (phoneNumber: string) => void;
  onNavigateToRecovery: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToRecovery }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onLogin(phoneNumber.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="text-center mb-10">
        <div className="bg-blue-500 inline-block p-4 rounded-full shadow-lg mb-4">
          <GasPumpIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome to GasPay</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Your fuel budget, simplified.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <div className="mt-1">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
              placeholder="e.g., 024 123 4567"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600 transition-transform transform hover:scale-105"
        >
          Sign In / Sign Up
        </button>
      </form>
       <button
        onClick={onNavigateToRecovery}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-4"
      >
        Trouble signing in?
      </button>

       <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-auto">
        By continuing, you agree to our Terms of Service.
      </p>
    </div>
  );
};

export default LoginScreen;