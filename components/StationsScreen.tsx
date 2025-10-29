import React, { useState, useEffect } from 'react';
import { GasStation } from '../types';
import { MapMarkerIcon, GasPumpIcon } from './icons/Icons';

interface StationsScreenProps {
  stations: GasStation[];
}

const StationsScreen: React.FC<StationsScreenProps> = ({ stations }) => {
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    // Simulate getting user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // Fallback to a default location if permission is denied
        setUserLocation({ lat: 5.6037, lng: -0.1870 }); 
      }
    );
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Nearby Stations</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 mb-6">
        <div className="h-64 bg-gray-300 rounded-xl flex items-center justify-center relative overflow-hidden">
          {/* This is a static image placeholder for a map */}
          <img src="https://storage.googleapis.com/maker-media-0.appspot.com/exports/1721927870344/0/2.png" className="w-full h-full object-cover dark:brightness-75" alt="Map of Accra with pins for gas stations"/>
          {userLocation && <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} title="Your Location"></div>}
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-700 dark:text-gray-300">List View</h2>
        {stations.map(station => (
          <div key={station.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                    <GasPumpIcon className="w-6 h-6 text-green-600 dark:text-green-400"/>
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{station.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Approx. 2km away</p>
                </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <MapMarkerIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StationsScreen;