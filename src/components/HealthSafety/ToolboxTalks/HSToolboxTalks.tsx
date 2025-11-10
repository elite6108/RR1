import React, { useState, useEffect } from 'react';
import { FileText, Clipboard, ChevronLeft } from 'lucide-react';
import SpotlightCard from '../../../styles/spotlight/SpotlightCard';
import { ToolboxTalksList } from './ToolboxTalksList';
import { CompletedTalksList } from './CompletedTalksList';
import { ToolboxTalkPDFs } from './ToolboxTalkPDFs';
import { supabase } from '../../../lib/supabase';

interface HSToolboxTalksProps {
  onBack: () => void;
}

export function HSToolboxTalks({ onBack }: HSToolboxTalksProps) {
  const [showTalksList, setShowTalksList] = useState(false);
  const [showCompletedTalks, setShowCompletedTalks] = useState(false);
  const [showPDFs, setShowPDFs] = useState(false);
  
  // State for counts
  const [toolboxTalksCount, setToolboxTalksCount] = useState(0);
  const [completedTalksCount, setCompletedTalksCount] = useState(0);
  const [pdfFilesCount, setPdfFilesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Detect dark mode from document class
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Fetch counts on component mount
  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);

      // Fetch toolbox talks count (static array from ToolboxTalksList)
      const TOOLBOX_TALKS = [
        { id: 'TBT1', title: 'Abrasive Wheels' },
        { id: 'TBT2', title: 'Accident Prevention & Control' },
        { id: 'TBT5', title: 'Asbestos' },
        { id: 'TBT8', title: 'Cartridge Operated Tools' },
        { id: 'TBT11', title: 'Control of Noise' },
        { id: 'TBT12', title: 'COSHH' },
        { id: 'TBT15', title: 'Fire Prevention & Control' },
        { id: 'TBT18', title: 'General Site Health & Safety' },
        { id: 'TBT21', title: 'HFLs & Petroleum-based Adhesives' },
        { id: 'TBT24', title: 'Ladders' },
        { id: 'TBT27', title: 'Lifting Accessories' },
        { id: 'TBT30', title: 'Manual Handling' },
        { id: 'TBT31', title: 'Mobile Elevating Work Platforms' },
        { id: 'TBT34', title: 'Needle-stick Injuries' },
        { id: 'TBT37', title: 'Piling' },
        { id: 'TBT40', title: 'Portable, Hand-held Tools' },
        { id: 'TBT43', title: 'Protection of Skin' },
        { id: 'TBT46', title: 'Safe Stacking of Materials' },
        { id: 'TBT49', title: 'Safety Inspections & Consultation' },
        { id: 'TBT50', title: 'Safety Nets & Suspension Equipment' },
        { id: 'TBT53', title: 'Signallers and Slingers' },
        { id: 'TBT56', title: 'Sun Safety' },
        { id: 'TBT59', title: 'Trestles and Stepladders' },
        { id: 'TBT62', title: 'Vibration' },
        { id: 'TBT65', title: "Weil's Disease" },
        { id: 'TBT69', title: 'Working Over Water' },
        { id: 'TBT3', title: 'Accident Reporting & Investigation' },
        { id: 'TBT6', title: 'Benefits of Safety' },
        { id: 'TBT9', title: 'Chainsaws' },
        { id: 'TBT13', title: 'Electricity on Site' },
        { id: 'TBT16', title: 'First Aid' },
        { id: 'TBT19', title: 'Health & Safety at Work Act 1974' },
        { id: 'TBT22', title: 'Hoists and Hoist Towers' },
        { id: 'TBT25', title: 'Lead Hazards' },
        { id: 'TBT28', title: 'Lifting Equipment & operations' },
        { id: 'TBT32', title: 'Mobile Plant' },
        { id: 'TBT35', title: 'Personal Hygiene' },
        { id: 'TBT38', title: 'Plant and Equipment' },
        { id: 'TBT41', title: 'Powers of the HSE' },
        { id: 'TBT44', title: 'Risk Assessment & Method Statements' },
        { id: 'TBT47', title: 'Safe Working at Height' },
        { id: 'TBT51', title: 'Safety with Steelwork' },
        { id: 'TBT54', title: 'Site Transport' },
        { id: 'TBT57', title: 'System Scaffolds' },
        { id: 'TBT60', title: 'Tube & fittings Scaffolding' },
        { id: 'TBT63', title: 'Waste Management' },
        { id: 'TBT66', title: 'Welfare Arrangements' },
        { id: 'TBT67', title: 'Woodworking Machines' },
        { id: 'TBT70', title: 'Young People on Site' },
        { id: 'TBT42', title: 'Protection of Eyes' },
        { id: 'TBT45', title: 'Road & Street Safety' },
        { id: 'TBT48', title: 'Safety in Demolition' },
        { id: 'TBT52', title: 'Security On Site' },
        { id: 'TBT4', title: 'Alcohol and Drugs' },
        { id: 'TBT7', title: 'Buried Services' },
        { id: 'TBT10', title: 'Control of Dust & Fumes' },
        { id: 'TBT14', title: 'Excavations' },
        { id: 'TBT17', title: 'General Safety Legislation' },
        { id: 'TBT20', title: 'Health on Site' },
        { id: 'TBT23', title: 'Hydro Demolition' },
        { id: 'TBT26', title: 'Legal Duties of the Employees' },
        { id: 'TBT29', title: 'LPG & Other Compressed Gases' },
        { id: 'TBT33', title: 'Mobile Scaffold Towers' },
        { id: 'TBT36', title: 'Personal Protective Equipment' },
        { id: 'TBT39', title: 'Pollution Control' },
        { id: 'TBT55', title: 'Slips Trips and Falls' },
        { id: 'TBT58', title: 'Trackside Safety' },
        { id: 'TBT61', title: 'Vehicle Fuels' },
        { id: 'TBT64', title: 'Water Jetting' },
        { id: 'TBT68', title: 'Working in Confined Spaces' },
      ];
      setToolboxTalksCount(TOOLBOX_TALKS.length);

      // Fetch completed talks count
      const { count: completedCount, error: completedError } = await supabase
        .from('toolbox_talks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      if (completedError) throw completedError;
      setCompletedTalksCount(completedCount || 0);

      // Fetch PDF files count
      const { data: filesData, error: filesError } = await supabase.storage
        .from('toolbox-talks')
        .list();

      if (filesError) throw filesError;
      const pdfCount = filesData?.filter((file) => file.name.toLowerCase().endsWith('.pdf')).length || 0;
      setPdfFilesCount(pdfCount);

    } catch (error) {
      console.error('Error fetching counts:', error);
      // Set fallback values on error
      setToolboxTalksCount(67);
      setCompletedTalksCount(0);
      setPdfFilesCount(0);
    } finally {
      setLoading(false);
    }
  };

  if (showTalksList) {
    return <ToolboxTalksList onBack={() => setShowTalksList(false)} />;
  }

  if (showCompletedTalks) {
    return <CompletedTalksList onBack={() => setShowCompletedTalks(false)} />;
  }

  if (showPDFs) {
    return <ToolboxTalkPDFs onBack={() => setShowPDFs(false)} />;
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Health & Safety
        </button>
        </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Toolbox Talk Management
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Toolbox Talks Widget */}
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(255, 214, 92, 0.4)"
          darkSpotlightColor="rgba(255, 214, 92, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowTalksList(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  01
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Toolbox Talks
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {loading ? '...' : toolboxTalksCount}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </button>
        </SpotlightCard>

        {/* Completed Talks Widget */}
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(255, 214, 92, 0.4)"
          darkSpotlightColor="rgba(255, 214, 92, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowCompletedTalks(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  02
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Completed Talks
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {loading ? '...' : completedTalksCount}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <Clipboard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </button>
        </SpotlightCard>

        {/* PDF Files Widget */}
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(255, 214, 92, 0.4)"
          darkSpotlightColor="rgba(255, 214, 92, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowPDFs(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  03
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  PDF Files
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {loading ? '...' : pdfFilesCount}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </button>
        </SpotlightCard>
      </div>
    </div>
  );
}
