import React, { useState } from 'react';
import { AppLogoIcon, ShieldCheckIcon } from './icons/Icons';

interface LoginScreenProps {
  onLoginRequest: (phoneNumber: string) => void;
  onNavigateToRecovery: () => void;
  isBiometricEnabled: boolean;
  onBiometricLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginRequest, onNavigateToRecovery, isBiometricEnabled, onBiometricLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onLoginRequest(phoneNumber.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in">
       <div className="w-full max-w-sm">
            <div className="text-center mb-10">
                <AppLogoIcon className="w-20 h-20 inline-block mb-4" />
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
                Send Code
                </button>
            </form>

            {isBiometricEnabled && (
                <div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 dark:before:border-gray-600 after:flex-1 after:border-t after:border-gray-300 dark:after:border-gray-600">
                    <p className="mx-4 text-center text-sm text-gray-500 dark:text-gray-400">or</p>
                </div>
            )}

            {isBiometricEnabled && (
                <button
                    type="button"
                    onClick={onBiometricLogin}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <ShieldCheckIcon className="w-5 h-5" />
                    Login with Biometrics
                </button>
            )}

            <div className="text-center mt-6">
                <button
                    onClick={onNavigateToRecovery}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Trouble signing in?
                </button>
            </div>
        </div>

       <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-auto pt-8">
        By continuing, you agree to our Terms of Service.
      </p>
    </div>
  );
};

export default LoginScreen;
