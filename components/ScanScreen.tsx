import React, { useEffect, useState } from 'react';
import { XMarkIcon, QrCodeIcon } from './icons/Icons';

interface ScanScreenProps {
  onScanSuccess: (data: { station: string; amount: number }) => void;
  onCancel: () => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onScanSuccess, onCancel }) => {
  const [status, setStatus] = useState('Scanning...');

  useEffect(() => {
    // Simulate a successful scan after a delay
    const scanTimeout = setTimeout(() => {
      setStatus('Scan successful!');
      const mockScannedData = {
        station: 'Allied Oil Madina',
        amount: parseFloat((Math.random() * (70 - 25) + 25).toFixed(2)),
      };
      
      // Give feedback to user before transitioning
      const transitionTimeout = setTimeout(() => {
        onScanSuccess(mockScannedData);
      }, 700);

      return () => clearTimeout(transitionTimeout);

    }, 2500);

    return () => clearTimeout(scanTimeout);
  }, [onScanSuccess]);


  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 animate-fade-in">
      <button 
        onClick={onCancel} 
        className="absolute top-6 right-6 p-2 bg-black/50 rounded-full"
        aria-label="Cancel scanning"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      <div className="relative w-64 h-64">
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
        
        {/* Animated scanning line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-scan-line"></div>
      </div>
      
      <div className="mt-8 text-center">
        <h1 className="text-xl font-bold">Point camera at QR code</h1>
        <p className="text-gray-300 mt-2 flex items-center justify-center gap-2">
            <QrCodeIcon className="w-5 h-5" />
            <span>{status}</span>
        </p>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); }
          100% { transform: translateY(16rem); }
        }
        .animate-scan-line {
          animation: scan-line 2s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ScanScreen;
