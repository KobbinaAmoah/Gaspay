import React from 'react';
import { Screen } from '../types';
import { HomeIcon, HistoryIcon, WalletIcon, UserIcon, MapMarkerIcon } from './icons/Icons';

interface BottomNavBarProps {
  activeScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  screen: Screen;
  activeScreen: Screen;
  setScreen: (screen: Screen) => void;
  Icon: React.ElementType;
  label: string;
}> = ({ screen, activeScreen, setScreen, Icon, label }) => {
  const isActive = activeScreen === screen;
  return (
    <button
      onClick={() => setScreen(screen)}
      className={`flex flex-col items-center justify-center w-1/5 transition-colors duration-300 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'}`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Go to ${label}`}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className={`text-xs font-bold ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`}>{label}</span>
    </button>
  );
};


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeScreen, setScreen }) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.2)] rounded-t-2xl">
      <div className="flex justify-around items-center h-full px-2">
        <NavItem screen={Screen.Dashboard} activeScreen={activeScreen} setScreen={setScreen} Icon={HomeIcon} label="Home" />
        <NavItem screen={Screen.History} activeScreen={activeScreen} setScreen={setScreen} Icon={HistoryIcon} label="History" />
        <NavItem screen={Screen.Stations} activeScreen={activeScreen} setScreen={setScreen} Icon={MapMarkerIcon} label="Stations" />
        <NavItem screen={Screen.Budget} activeScreen={activeScreen} setScreen={setScreen} Icon={WalletIcon} label="Budget" />
        <NavItem screen={Screen.Profile} activeScreen={activeScreen} setScreen={setScreen} Icon={UserIcon} label="Profile" />
      </div>
    </div>
  );
};

export default BottomNavBar;