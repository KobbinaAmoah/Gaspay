import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheckIcon } from './icons/Icons';

interface OtpScreenProps {
  phoneNumber: string;
  onVerify: (otp: string) => boolean;
  onNavigateToLogin: () => void;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ phoneNumber, onVerify, onNavigateToLogin }) => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // FIX: Cannot find namespace 'NodeJS'. Use browser-compatible timer type.
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResend = () => {
    // In a real app, this would trigger an API call to resend the OTP
    setResendCooldown(30);
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
    
    // Auto-submit if all fields are filled
    if (newOtp.every(digit => digit !== '')) {
      handleSubmit(newOtp.join(''));
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && inputsRef.current[index - 1]) {
        inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (fullOtp: string) => {
    const success = onVerify(fullOtp);
    if (!success) {
      setError("Invalid code. Please try again.");
      setOtp(new Array(4).fill("")); // Reset inputs on error
      inputsRef.current[0]?.focus();
    } else {
      setError(null);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length === 4) {
        handleSubmit(fullOtp);
    }
  }


  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="text-center mb-10">
        <div className="bg-green-100 dark:bg-green-900/50 inline-block p-4 rounded-full shadow-lg mb-4">
          <ShieldCheckIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Enter Code</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          We sent a 4-digit code to <br/> <span className="font-semibold text-gray-700 dark:text-gray-300">{phoneNumber}</span>
        </p>
      </div>

      <form onSubmit={onFormSubmit} className="w-full space-y-6">
        <div className="flex justify-center gap-2 md:gap-4">
          {otp.map((data, index) => (
            <input
              key={index}
              // FIX: Type '(el: HTMLInputElement) => HTMLInputElement' is not assignable to type 'Ref<HTMLInputElement>'.
              ref={el => { inputsRef.current[index] = el; }}
              type="text"
              name="otp"
              maxLength={1}
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={e => e.target.select()}
              className={`w-14 h-16 md:w-16 md:h-20 text-center text-2xl md:text-3xl font-semibold border rounded-xl shadow-sm transition-all
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'}
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2`}
            />
          ))}
        </div>

         <p className="text-center text-xs text-blue-500 dark:text-blue-400">
           For testing, your code is <span className="font-bold">1234</span>
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600 transition-transform transform hover:scale-105"
        >
          Verify
        </button>
      </form>
      
      <div className="text-sm text-center mt-4">
        {resendCooldown > 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Resend code in {resendCooldown}s</p>
        ) : (
          <button onClick={handleResend} className="text-blue-600 dark:text-blue-400 hover:underline">
            Resend Code
          </button>
        )}
      </div>

      <button
        onClick={onNavigateToLogin}
        className="text-sm text-gray-500 dark:text-gray-400 hover:underline mt-auto"
      >
        Use a different phone number
      </button>
    </div>
  );
};

export default OtpScreen;