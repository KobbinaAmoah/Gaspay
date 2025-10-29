import React, { useEffect } from 'react';
import { Notification } from '../types';
import { BellIcon, CheckCircleIcon, InfoCircleIcon, WarningIcon, StarIcon } from './icons/Icons';

interface NotificationsScreenProps {
  notifications: Notification[];
  onMarkAsRead: () => void;
}

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />;
    case 'warning':
      return <WarningIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
    case 'reward':
        return <StarIcon className="w-6 h-6 text-yellow-400" />;
    case 'info':
    default:
      return <InfoCircleIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
  }
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ notifications, onMarkAsRead }) => {

  useEffect(() => {
    // Mark notifications as read when the component is unmounted
    return () => {
      onMarkAsRead();
    };
  }, [onMarkAsRead]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Notifications</h1>
      
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className={`bg-white dark:bg-gray-800 rounded-xl p-4 flex items-start gap-4 shadow-sm ${!notif.read ? 'border-l-4 border-blue-500' : 'dark:border-l-4 dark:border-transparent'}`}>
              <div className="mt-1">
                <NotificationIcon type={notif.type} />
              </div>
              <div>
                <p className={`font-medium text-gray-800 dark:text-gray-200 ${!notif.read ? 'font-bold' : ''}`}>{notif.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(notif.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <BellIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications yet.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Important updates will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;