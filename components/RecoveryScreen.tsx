import React, { useState } from 'react';
import { EnvelopeIcon, InfoCircleIcon } from './icons/Icons';

interface RecoveryScreenProps {
  onNavigateToLogin: () => void;
}

const RecoveryScreen: React.FC<RecoveryScreenProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !isLoading) {
      setIsLoading(true);
      // Simulate network request
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="text-center mb-10">
        <div className="bg-blue-100 dark:bg-blue-900/50 inline-block p-4 rounded-full shadow-lg mb-4">
          <EnvelopeIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Account Recovery</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Find your registered phone number.</p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Registered Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-wait"
          >
            {isLoading ? 'Sending...' : 'Send Recovery Link'}
          </button>
        </form>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-lg flex flex-col items-center gap-3 shadow-md w-full text-center">
          <InfoCircleIcon className="w-8 h-8 flex-shrink-0" />
          <div>
            <p className="font-bold">Check your inbox!</p>
            <p className="text-sm">If an account is associated with that email, recovery details have been sent.</p>
            <p className="text-xs mt-2 dark:text-blue-400">Hint: The registered number is <span className="font-mono">024 123 4567</span></p>
          </div>
        </div>
      )}

      <button
        onClick={onNavigateToLogin}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-6"
      >
        Back to Login
      </button>

      <div className="flex-grow"></div>
    </div>
  );
};

export default RecoveryScreen;
