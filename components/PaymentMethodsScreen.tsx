import React, { useState, useCallback } from 'react';
import { PaymentMethod } from '../types';
import { PlusIcon, MtnIcon, VodafoneIcon, AirtelTigoIcon, TrashIcon, DevicePhoneMobileIcon } from './icons/Icons';

interface PaymentMethodsScreenProps {
  methods: PaymentMethod[];
  onAddMethod: (method: Omit<PaymentMethod, 'id' | 'isPrimary'>) => void;
  onRemoveMethod: (methodId: string) => void;
  onSetPrimary: (methodId: string) => void;
}

const ProviderIcon: React.FC<{ provider: PaymentMethod['provider'] }> = ({ provider }) => {
  switch (provider) {
    case 'MTN':
      return <MtnIcon className="h-8 w-auto" />;
    case 'Vodafone':
      return <VodafoneIcon className="h-8 w-8" />;
    case 'AirtelTigo':
      return <AirtelTigoIcon className="h-7 w-auto" />;
    default:
      return null;
  }
};

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ methods, onAddMethod, onRemoveMethod, onSetPrimary }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [methodToRemove, setMethodToRemove] = useState<PaymentMethod | null>(null);
  const [confirmingPrimary, setConfirmingPrimary] = useState<PaymentMethod | null>(null);

  const [newMethod, setNewMethod] = useState({
    provider: 'MTN' as PaymentMethod['provider'],
    phoneNumber: '',
  });

  const handleAddSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newMethod.phoneNumber.trim()) {
      onAddMethod(newMethod);
      setIsAddModalOpen(false);
      setNewMethod({ provider: 'MTN', phoneNumber: '' });
    }
  }, [newMethod, onAddMethod]);

  const handleRemoveConfirm = useCallback(() => {
    if (methodToRemove) {
      onRemoveMethod(methodToRemove.id);
      setMethodToRemove(null);
    }
  }, [methodToRemove, onRemoveMethod]);

  const handleSetPrimaryClick = useCallback((method: PaymentMethod) => {
    if (!method.isPrimary) {
      setConfirmingPrimary(method);
    }
  }, []);

  const handlePrimaryConfirmation = useCallback(() => {
    if (confirmingPrimary) {
      onSetPrimary(confirmingPrimary.id);
      setConfirmingPrimary(null);
    }
  }, [confirmingPrimary, onSetPrimary]);


  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">Payment Methods</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 space-y-4">
        {methods.length > 0 ? (
          methods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center gap-4">
                <ProviderIcon provider={method.provider} />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{method.provider} Mobile Money</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{method.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 {method.isPrimary ? (
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded-full">Primary</span>
                 ) : (
                    <button onClick={() => handleSetPrimaryClick(method)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        Set as Primary
                    </button>
                 )}
                <button onClick={() => setMethodToRemove(method)} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                    <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No payment methods added yet.</p>
        )}
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold py-3 px-6 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        Add New Method
      </button>

      {/* Add Method Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Payment Method</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provider</label>
                <select 
                  value={newMethod.provider} 
                  onChange={(e) => setNewMethod(prev => ({ ...prev, provider: e.target.value as PaymentMethod['provider'] }))}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>MTN</option>
                  <option>Vodafone</option>
                  <option>AirtelTigo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  value={newMethod.phoneNumber}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                  placeholder="024 123 4567"
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Remove Confirmation Dialog */}
      {methodToRemove && (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center animate-fade-in-up">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                    <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Remove Method?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to remove <span className="font-semibold">{methodToRemove.provider} - {methodToRemove.phoneNumber}</span>?
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <button onClick={() => setMethodToRemove(null)} className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
                    <button onClick={handleRemoveConfirm} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700">Remove</button>
                </div>
            </div>
        </div>
      )}
      
      {/* Set Primary Confirmation (USSD) Modal */}
      {confirmingPrimary && (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center animate-fade-in-up">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <DevicePhoneMobileIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Confirm on Your Phone</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    A USSD prompt has been sent to <span className="font-semibold">{confirmingPrimary.phoneNumber}</span>. Please approve it to set this as your primary payment method.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <button onClick={() => setConfirmingPrimary(null)} className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
                    <button onClick={handlePrimaryConfirmation} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">I Have Approved</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default PaymentMethodsScreen;