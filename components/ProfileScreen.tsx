import React, { useState } from 'react';
import { User, Screen, Theme } from '../types';
import { UserIcon, ChevronRightIcon, SunIcon, MoonIcon, WarningIcon, TrashIcon, ShieldCheckIcon } from './icons/Icons';
import ActionConfirmationOtpModal from './ActionConfirmationOtpModal';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onDeleteAccount: () => void;
  setScreen: (screen: Screen) => void;
  theme: Theme;
  toggleTheme: () => void;
  isBiometricEnabled: boolean;
  onSetBiometricEnabled: (enabled: boolean) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onDeleteAccount, setScreen, theme, toggleTheme, isBiometricEnabled, onSetBiometricEnabled }) => {
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);

  const handleDeleteRequest = () => {
    setIsDeleteConfirmVisible(false);
    setIsOtpModalVisible(true);
  };

  const handleOtpVerified = () => {
    setIsOtpModalVisible(false);
    onDeleteAccount();
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">My Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4">
        <div className="bg-gray-200 dark:bg-gray-700 p-5 rounded-full">
          <UserIcon className="w-12 h-12 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Signed in as</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">{user.phoneNumber}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3">
        <h2 className="px-4 pt-2 pb-1 text-sm font-semibold text-gray-500 dark:text-gray-400">Appearance</h2>
        <div className="flex justify-between items-center p-4">
            <span className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
                onClick={toggleTheme}
                className="relative inline-flex items-center h-7 w-14 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
            >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-800 shadow transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}>
                    {theme === 'light' ? 
                        <SunIcon className="h-4 w-4 m-1 text-yellow-500" /> : 
                        <MoonIcon className="h-4 w-4 m-1 text-blue-400" />
                    }
                </span>
            </button>
        </div>
      </div>

       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3">
        <h2 className="px-4 pt-2 pb-1 text-sm font-semibold text-gray-500 dark:text-gray-400">Security</h2>
        <div className="flex justify-between items-center p-4">
            <span className="font-medium text-gray-700 dark:text-gray-300">Biometric Login</span>
            <button
                onClick={() => onSetBiometricEnabled(!isBiometricEnabled)}
                className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${isBiometricEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                aria-label="Toggle biometric login"
            >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-800 shadow transition-transform ${isBiometricEnabled ? 'translate-x-7' : 'translate-x-1'}`}>
                    <ShieldCheckIcon className={`h-4 w-4 m-1 ${isBiometricEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                </span>
            </button>
        </div>
      </div>


      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3">
         <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <ProfileButton text="My Rewards" onClick={() => setScreen(Screen.Rewards)} />
            <ProfileButton text="Transaction History" onClick={() => setScreen(Screen.History)} />
            <ProfileButton text="Notifications" onClick={() => setScreen(Screen.Notifications)} />
            <ProfileButton text="Payment Methods" onClick={() => setScreen(Screen.PaymentMethods)} />
            <ProfileButton text="Help & Support" onClick={() => {}} />
         </div>
      </div>

      <div className="pt-4 space-y-4">
        <button
          onClick={onLogout}
          className="w-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-bold py-3 px-6 rounded-xl hover:bg-red-200 dark:hover:bg-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
        <button
          onClick={() => setIsDeleteConfirmVisible(true)}
          className="w-full text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 py-2"
        >
            Delete Account
        </button>
      </div>

      {isDeleteConfirmVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center animate-fade-in-up"
            >
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                    <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 id="delete-account-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">Delete Account</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                        onClick={() => setIsDeleteConfirmVisible(false)}
                        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteRequest}
                        className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {isOtpModalVisible && (
        <ActionConfirmationOtpModal
          phoneNumber={user.phoneNumber}
          onVerify={handleOtpVerified}
          onCancel={() => setIsOtpModalVisible(false)}
          actionText="Delete Account"
          title="Verify Deletion"
        />
      )}
    </div>
  );
};

const ProfileButton: React.FC<{text: string; onClick: () => void;}> = ({ text, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center text-left p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <span className="font-medium text-gray-700 dark:text-gray-300">{text}</span>
        <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
    </button>
)

export default ProfileScreen;
