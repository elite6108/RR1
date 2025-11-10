import React from 'react';
import SpotlightCard from '../../../../../styles/spotlight/SpotlightCard';

interface StatisticCardProps {
  title: string;
  subtitle: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

export function StatisticCard({ 
  title, 
  subtitle, 
  value, 
  icon, 
  color, 
  backgroundColor = "bg-white dark:bg-gray-800",
  borderColor,
  textColor = "text-gray-900 dark:text-white"
}: StatisticCardProps) {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <SpotlightCard
      isDarkMode={isDarkMode}
      spotlightColor={`rgba(${color}, 0.4)`}
      darkSpotlightColor={`rgba(${color}, 0.2)`}
      size={400}
      className={`${backgroundColor} rounded-2xl shadow-lg p-6 overflow-hidden relative ${borderColor ? `border ${borderColor}` : ''}`}
    >
      <div className="relative z-10">
        <div className="mb-6">
          <h3 className={`text-xl font-bold ${textColor} mt-1 text-left`}>
            {title}
          </h3>
          <p className={`text-sm ${textColor.includes('gray') ? 'text-gray-500 dark:text-gray-400' : textColor}`}>
            {subtitle}
          </p>
        </div>
        <div className={`text-lg font-medium ${textColor} text-left`}>
          {value}
        </div>
      </div>
      <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
            <path fill="#F3F4F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color }}>
          {icon}
        </div>
      </div>
    </SpotlightCard>
  );
}
