import React, { useEffect } from 'react';
import { ShieldCheckIcon } from './icons/Icons';

interface BiometricPromptProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const BiometricPrompt: React.FC<BiometricPromptProps> = ({ onSuccess, onCancel }) => {
  useEffect(() => {
    // Simulate a successful biometric scan after a short delay
    const timer = setTimeout(() => {
      onSuccess();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="biometric-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4 animate-pulse">
          <ShieldCheckIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 id="biometric-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">Biometric Login</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Please use your fingerprint or face to log in.
        </p>
        <button
          onClick={onCancel}
          className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BiometricPrompt;
