import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheckIcon } from './icons/Icons';
import { api } from '../services/api';

interface ActionConfirmationOtpModalProps {
  phoneNumber: string;
  onVerify: () => void;
  onCancel: () => void;
  actionText: string;
  title: string;
}

const ActionConfirmationOtpModal: React.FC<ActionConfirmationOtpModalProps> = ({ phoneNumber, onVerify, onCancel, actionText, title }) => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    setError(null);
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== otp.length) {
      setError("Please enter the complete code.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const success = await api.verifyActionOtp(otpValue);
    
    setIsLoading(false);

    if (success) {
      onVerify();
    } else {
      setError("Invalid code. Please try again.");
      setOtp(new Array(4).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50">
          <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 id="otp-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          For your security, please enter the 4-digit code we sent to your number ending in <span className="font-semibold">{phoneNumber.slice(-4)}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-2 sm:gap-4">
            {otp.map((data, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border rounded-xl shadow-sm transition ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-wait"
            >
              {isLoading ? 'Verifying...' : actionText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionConfirmationOtpModal;