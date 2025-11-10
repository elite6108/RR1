import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Plus, Search } from 'lucide-react';
import { ToolboxTalkForm } from './ToolboxTalkForm';
import { CompletedTalksList } from './CompletedTalksList';

interface ToolboxTalksListProps {
  onBack: () => void;
}

const TOOLBOX_TALKS = [
  { id: 'TBT1', title: 'Abrasive Wheels' },
  { id: 'TBT3', title: 'Accident Reporting & Investigation' },
  { id: 'TBT2', title: 'Accident Prevention & Control' },
  { id: 'TBT4', title: 'Alcohol and Drugs' },
  { id: 'TBT5', title: 'Asbestos' },
  { id: 'TBT6', title: 'Benefits of Safety' },
  { id: 'TBT7', title: 'Buried Services' },
  { id: 'TBT8', title: 'Cartridge Operated Tools' },
  { id: 'TBT9', title: 'Chainsaws' },
  { id: 'TBT10', title: 'Control of Dust & Fumes' },
  { id: 'TBT11', title: 'Control of Noise' },
  { id: 'TBT12', title: 'COSHH' },
  { id: 'TBT13', title: 'Electricity on Site' },
  { id: 'TBT14', title: 'Excavations' },
  { id: 'TBT15', title: 'Fire Prevention & Control' },
  { id: 'TBT16', title: 'First Aid' },
  { id: 'TBT17', title: 'General Safety Legislation' },
  { id: 'TBT18', title: 'General Site Health & Safety' },
  { id: 'TBT19', title: 'Health & Safety at Work Act 1974' },
  { id: 'TBT20', title: 'Health on Site' },
  { id: 'TBT21', title: 'HFLs & Petroleum-based Adhesives' },
  { id: 'TBT22', title: 'Hoists and Hoist Towers' },
  { id: 'TBT23', title: 'Hydro Demolition' },
  { id: 'TBT24', title: 'Ladders' },
  { id: 'TBT25', title: 'Lead Hazards' },
  { id: 'TBT26', title: 'Legal Duties of the Employees' },
  { id: 'TBT27', title: 'Lifting Accessories' },
  { id: 'TBT28', title: 'Lifting Equipment & operations' },
  { id: 'TBT29', title: 'LPG & Other Compressed Gases' },
  { id: 'TBT30', title: 'Manual Handling' },
  { id: 'TBT31', title: 'Mobile Elevating Work Platforms' },
  { id: 'TBT32', title: 'Mobile Plant' },
  { id: 'TBT33', title: 'Mobile Scaffold Towers' },
  { id: 'TBT34', title: 'Needle-stick Injuries' },
  { id: 'TBT35', title: 'Personal Hygiene' },
  { id: 'TBT36', title: 'Personal Protective Equipment' },
  { id: 'TBT37', title: 'Piling' },
  { id: 'TBT38', title: 'Plant and Equipment' },
  { id: 'TBT39', title: 'Pollution Control' },
  { id: 'TBT40', title: 'Portable, Hand-held Tools' },
  { id: 'TBT41', title: 'Powers of the HSE' },
  { id: 'TBT42', title: 'Protection of Eyes' },
  { id: 'TBT43', title: 'Protection of Skin' },
  { id: 'TBT44', title: 'Risk Assessment & Method Statements' },
  { id: 'TBT45', title: 'Road & Street Safety' },
  { id: 'TBT46', title: 'Safe Stacking of Materials' },
  { id: 'TBT47', title: 'Safe Working at Height' },
  { id: 'TBT48', title: 'Safety in Demolition' },
  { id: 'TBT49', title: 'Safety Inspections & Consultation' },
  { id: 'TBT50', title: 'Safety Nets & Suspension Equipment' },
  { id: 'TBT51', title: 'Safety with Steelwork' },
  { id: 'TBT52', title: 'Security On Site' },
  { id: 'TBT53', title: 'Signallers and Slingers' },
  { id: 'TBT54', title: 'Site Transport' },
  { id: 'TBT55', title: 'Slips Trips and Falls' },
  { id: 'TBT56', title: 'Sun Safety' },
  { id: 'TBT57', title: 'System Scaffolds' },
  { id: 'TBT58', title: 'Trackside Safety' },
  { id: 'TBT59', title: 'Trestles and Stepladders' },
  { id: 'TBT60', title: 'Tube & fittings Scaffolding' },
  { id: 'TBT61', title: 'Vehicle Fuels' },
  { id: 'TBT62', title: 'Vibration' },
  { id: 'TBT63', title: 'Waste Management' },
  { id: 'TBT64', title: 'Water Jetting' },
  { id: 'TBT65', title: "Weil's Disease" },
  { id: 'TBT66', title: 'Welfare Arrangements' },
  { id: 'TBT67', title: 'Woodworking Machines' },
  { id: 'TBT68', title: 'Working in Confined Spaces' },
  { id: 'TBT69', title: 'Working Over Water' },
  { id: 'TBT70', title: 'Young People on Site' },
];

export function ToolboxTalksList({ onBack }: ToolboxTalksListProps) {
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [showCompletedTalks, setShowCompletedTalks] = useState(false);
  const [selectedTalk, setSelectedTalk] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTalkClick = (talk: { id: string; title: string }) => {
    setSelectedTalk(talk);
    setShowTalkModal(true);
  };

  const filteredTalks = TOOLBOX_TALKS.filter((talk) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      talk.id.toLowerCase().includes(searchLower) ||
      talk.title.toLowerCase().includes(searchLower)
    );
  });

  if (showCompletedTalks) {
    return <CompletedTalksList onBack={() => setShowCompletedTalks(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Toolbox Talks
        </button>
        
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Toolbox Talks</h2>
      </div>

      {/* Search Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <button
          onClick={() => setShowCompletedTalks(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
        >
          View Completed Talks
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Desktop Grid View */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTalks.map((talk) => (
                <button
                  key={talk.id}
                  onClick={() => handleTalkClick(talk)}
                  className="text-left p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-150 ease-in-out border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {talk.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{talk.id}</p>
                    </div>
                    <Plus className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet List View */}
          <div className="md:hidden">
            <div className="space-y-3">
              {filteredTalks.map((talk) => (
                <button
                  key={talk.id}
                  onClick={() => handleTalkClick(talk)}
                  className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-150 ease-in-out border border-gray-200 dark:border-gray-600 active:scale-95 active:bg-gray-200 dark:active:bg-gray-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white leading-tight">
                        {talk.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{talk.id}</p>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {filteredTalks.length === 0 && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No toolbox talks found matching your search
              </p>
            </div>
          )}
        </div>
      </div>

      {showTalkModal && selectedTalk && (
        createPortal(
          <ToolboxTalkForm
            talk={selectedTalk}
            onClose={() => {
              setShowTalkModal(false);
              setSelectedTalk(null);
            }}
            onNavigateToCompletedTalks={() => setShowCompletedTalks(true)}
          />,
          document.body
        )
      )}
    </div>
  );
}
