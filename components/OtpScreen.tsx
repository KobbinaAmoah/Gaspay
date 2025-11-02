import React, { useState, useRef, useEffect } from 'react';

interface OtpScreenProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onGoBack: () => void;
  onResend: () => void;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ phoneNumber, onVerify, onGoBack, onResend }) => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === otp.length) {
      onVerify(otpValue);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Enter Code</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          We sent a 4-digit code to <br />
          <span className="font-semibold text-gray-700 dark:text-gray-300">{phoneNumber}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex justify-center gap-2 sm:gap-4">
          {otp.map((data, index) => (
            <input
              key={index}
              // Fix: Changed implicit return in ref callback to a block body to return void.
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className="w-14 h-16 sm:w-16 sm:h-20 text-center text-3xl font-bold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600 transition-transform transform hover:scale-105"
        >
          Verify
        </button>
      </form>
      
       <div className="text-center mt-4">
         <p className="text-sm text-gray-500 dark:text-gray-400">
           Didn't receive the code?{' '}
           <button onClick={onResend} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
             Resend
           </button>
         </p>
         <button onClick={onGoBack} className="text-sm text-gray-500 dark:text-gray-400 hover:underline mt-2">
            Use a different number
        </button>
       </div>
    </div>
  );
};

export default OtpScreen;