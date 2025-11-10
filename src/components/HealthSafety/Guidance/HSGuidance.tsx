import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import SpotlightCard from '../../../styles/spotlight/SpotlightCard';
import { GuidanceGuides } from './GuidanceGuides';
import { CodeOfPractice } from './CodeOfPractice';
import { useDocumentCounts } from './hooks';
import { BreadcrumbNavigation } from './components';

interface HSGuidanceProps {
  onBack: () => void;
}

/**
 * Main Health & Safety Guidance component
 * Provides navigation to different guidance document types and displays counts
 */
export function HSGuidance({ onBack }: HSGuidanceProps) {
  const [showGuides, setShowGuides] = useState(false);
  const [showCodeOfPractice, setShowCodeOfPractice] = useState(false);
  
  // Get document counts
  const { guidesCount, codeOfPracticeCount, loading } = useDocumentCounts();

  // Detect dark mode from document class
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Show specific document type views
  if (showGuides) {
    return <GuidanceGuides onBack={() => setShowGuides(false)} />;
  }

  if (showCodeOfPractice) {
    return <CodeOfPractice onBack={() => setShowCodeOfPractice(false)} />;
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation 
        onBack={onBack} 
        backText="Back to Health & Safety" 
      />

      {/* Page Header */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Health & Safety Guidance
      </h2>

      {/* Document Type Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Guides Widget */}
        <GuidanceCard
          isDarkMode={isDarkMode}
          number="01"
          title="Guides"
          count={loading ? '...' : guidesCount}
          icon={(props) => (
            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
          onClick={() => setShowGuides(true)}
        />

        {/* Code of Practice Widget */}
        <GuidanceCard
          isDarkMode={isDarkMode}
          number="02"
          title="Code of Practice"
          count={loading ? '...' : codeOfPracticeCount}
          icon={FileText}
          onClick={() => setShowCodeOfPractice(true)}
        />
      </div>
    </div>
  );
}

interface GuidanceCardProps {
  isDarkMode: boolean;
  number: string;
  title: string;
  count: string | number;
  icon: (props: { className?: string; style?: React.CSSProperties }) => React.ReactElement;
  onClick: () => void;
}

/**
 * Individual guidance card component with spotlight effect
 * Displays document type information and count with visual styling
 */
const GuidanceCard = ({
  isDarkMode,
  number,
  title,
  count,
  icon: Icon,
  onClick
}: GuidanceCardProps) => {
  return (
    <SpotlightCard
      isDarkMode={isDarkMode}
      spotlightColor="rgba(255, 214, 92, 0.4)"
      darkSpotlightColor="rgba(255, 214, 92, 0.2)"
      size={400}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
    >
      <button
        onClick={onClick}
        className="w-full h-full text-left"
      >
        <div className="relative z-10">
          {/* Card Header */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
              {number}
            </p>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
              {title}
            </h3>
          </div>
          
          {/* Document Count */}
          <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
            {count}
          </div>
        </div>
        
        {/* Background Icon */}
        <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-full opacity-10 dark:opacity-20"
            >
              <path 
                fill="#FFF6F6" 
                d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" 
                transform="translate(100 100)" 
              />
            </svg>
          </div>
          <Icon 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" 
            style={{ color: '#FCA5A5' }} 
          />
        </div>
      </button>
    </SpotlightCard>
  );
};