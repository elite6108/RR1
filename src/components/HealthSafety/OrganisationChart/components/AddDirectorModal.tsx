import React from 'react';

interface AddDirectorModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  directorNames: string[];
  directorPositions: string[];
  setDirectorNames: (names: string[]) => void;
  setDirectorPositions: (positions: string[]) => void;
  onAddDirectors: () => void;
}

export const AddDirectorModal: React.FC<AddDirectorModalProps> = ({
  showAddModal,
  setShowAddModal,
  directorNames,
  directorPositions,
  setDirectorNames,
  setDirectorPositions,
  onAddDirectors
}) => {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Add Directors</h2>
        
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Director {index + 1}</label>
              <input
                type="text"
                value={directorNames[index]}
                onChange={(e) => {
                  const newNames = [...directorNames];
                  newNames[index] = e.target.value;
                  setDirectorNames(newNames);
                }}
                placeholder="Name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={directorPositions[index]}
                onChange={(e) => {
                  const newPositions = [...directorPositions];
                  newPositions[index] = e.target.value;
                  setDirectorPositions(newPositions);
                }}
                placeholder="Position"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setShowAddModal(false);
              setDirectorNames(['', '', '']);
              setDirectorPositions(['', '', '']);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onAddDirectors}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Directors
          </button>
        </div>
      </div>
    </div>
  );
};
