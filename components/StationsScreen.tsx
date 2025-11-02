import React, { useState, useEffect } from 'react';
import { GasStation } from '../types';
import { MapMarkerIcon, GasPumpIcon } from './icons/Icons';
import { getNearbyStations } from '../services/geminiService';

const StationsScreen: React.FC = () => {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        
        getNearbyStations(location)
          .then(fetchedStations => {
            setStations(fetchedStations);
          })
          .catch(() => {
            setError("Could not fetch nearby stations. Please try again later.");
          })
          .finally(() => {
            setLoading(false);
          });
      },
      () => {
        setError("Could not access your location. Please enable location services in your browser settings.");
        setLoading(false);
      }
    );
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300">Finding Stations...</h2>
          {[...Array(4)].map((_, i) => (
             <div key={i} className="animate-pulse flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                <div className="flex-1 space-y-3 py-1">
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-10 px-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
          <p className="font-semibold text-red-600 dark:text-red-400">An Error Occurred</p>
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
        </div>
      );
    }
    
    if (stations.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No gas stations found nearby.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-700 dark:text-gray-300">List View</h2>
        {stations.map(station => (
          <a 
            key={station.id}
            href={station.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md dark:hover:bg-gray-700/50 transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full flex-shrink-0">
                    <GasPumpIcon className="w-6 h-6 text-green-600 dark:text-green-400"/>
                </div>
                <div className="truncate">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{station.name}</p>
                    {station.uri && <p className="text-sm text-blue-500 dark:text-blue-400">View on Google Maps</p>}
                </div>
            </div>
            {station.uri && <MapMarkerIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2" />}
          </a>
        ))}
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 pt-4">
            Results powered by Google Maps.
        </p>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Nearby Stations</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 mb-6">
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl flex items-center justify-center relative overflow-hidden">
          <img src="https://storage.googleapis.com/maker-media-0.appspot.com/exports/1721927870344/0/2.png" className="w-full h-full object-cover dark:brightness-75" alt="Map of Accra with pins for gas stations"/>
          {userLocation && <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} title="Your Location"></div>}
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default StationsScreen;
