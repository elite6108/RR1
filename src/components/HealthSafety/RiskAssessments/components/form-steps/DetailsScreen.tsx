import React from 'react';

interface DetailsScreenProps {
  data: {
    name: string;
    location: string;
    assessor: string;
  };
  onChange: (data: Partial<typeof DetailsScreenProps.prototype.data>) => void;
}

export function DetailsScreen({ data, onChange }: DetailsScreenProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Details</h3>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <input
          type="text"
          id="location"
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="assessor" className="block text-sm font-medium text-gray-700 mb-2">
          Assessor *
        </label>
        <input
          type="text"
          id="assessor"
          value={data.assessor}
          disabled
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
        />
      </div>
    </div>
  );
}