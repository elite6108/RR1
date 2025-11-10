import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface ProtectionOfPublicProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function ProtectionOfPublic({ data, onChange }: ProtectionOfPublicProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Protection of Public</h3>
      
      <div>
        <label htmlFor="protection_of_public" className="block text-sm font-medium text-gray-700 mb-2">
          Public Protection Information *
        </label>
        <textarea
          id="protection_of_public"
          value={data.protection_of_public || RAMS_DEFAULTS.PROTECTION_OF_PUBLIC}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ protection_of_public: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}