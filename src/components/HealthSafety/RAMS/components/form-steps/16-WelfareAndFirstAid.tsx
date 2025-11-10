import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';
import { AIHospitalLocator } from '../AIHospitalLocator';

interface WelfareAndFirstAidProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function WelfareAndFirstAid({
  data,
  onChange,
}: WelfareAndFirstAidProps) {
  const [isHospitalLocatorOpen, setIsHospitalLocatorOpen] = useState(false);

  const handleApplyHospital = (hospital: string) => {
    onChange({ nearest_hospital: hospital });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Welfare & First Aid</h3>

      <div>
        <label
          htmlFor="welfare_first_aid"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Welfare & First Aid Information *
        </label>
        <textarea
          id="welfare_first_aid"
          value={data.welfare_first_aid || RAMS_DEFAULTS.WELFARE_FIRST_AID}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange({ welfare_first_aid: e.target.value })
          }
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="nearest_hospital"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nearest Hospital *
        </label>
        <div className="flex gap-2">
          <textarea
            id="nearest_hospital"
            value={data.nearest_hospital || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onChange({ nearest_hospital: e.target.value })
            }
            rows={4}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter nearest hospital details or use Auto Locate"
          />
          <button
            type="button"
            onClick={() => setIsHospitalLocatorOpen(true)}
            className="px-4 py-2 h-fit text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Auto Locate
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Use Auto Locate to find the nearest A&E hospital based on the site
          postcode
        </p>
      </div>

      <AIHospitalLocator
        isOpen={isHospitalLocatorOpen}
        onClose={() => setIsHospitalLocatorOpen(false)}
        onApplyHospital={handleApplyHospital}
        postcode={data.post_code || ''}
      />
    </div>
  );
}
