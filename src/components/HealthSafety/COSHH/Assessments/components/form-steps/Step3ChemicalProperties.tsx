import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CoshhAssessment } from '../../types';

interface IngredientItem {
  id: string;
  ingredient_name: string;
  wel_twa_8_hrs: string;
  stel_15_mins: string;
}

interface Step3ChemicalPropertiesProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
  ingredientItems: IngredientItem[];
  setIngredientItems: (items: IngredientItem[]) => void;
}

export const Step3ChemicalProperties: React.FC<Step3ChemicalPropertiesProps> = ({
  formData,
  setFormData,
  ingredientItems,
  setIngredientItems
}) => {
  const addIngredientItem = () => {
    const newItem: IngredientItem = {
      id: Date.now().toString(),
      ingredient_name: '',
      wel_twa_8_hrs: '',
      stel_15_mins: ''
    };
    setIngredientItems([...ingredientItems, newItem]);
  };

  const removeIngredientItem = (id: string) => {
    setIngredientItems(ingredientItems.filter(item => item.id !== id));
  };

  const updateIngredientItem = (id: string, field: keyof IngredientItem, value: string) => {
    setIngredientItems(ingredientItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Chemical Properties
      </h3>
      
      {/* Chemical Property Flags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Carcinogen <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setFormData({...formData, carcinogen: true})}
              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                formData.carcinogen
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, carcinogen: false})}
              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                !formData.carcinogen
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              No
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Indicates if the substance is known to cause cancer
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Sk (Skin Notation) <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setFormData({...formData, sk: true})}
              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                formData.sk
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, sk: false})}
              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                !formData.sk
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              No
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Indicates potential for skin absorption
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Sen (Sensitiser) <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setFormData({...formData, sen: true})}
              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                formData.sen
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, sen: false})}
              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                !formData.sen
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              No
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Indicates if substance can cause allergic reactions
          </p>
        </div>
      </div>

      {/* Ingredient Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Ingredient Items <span className="text-gray-400 text-xs">(optional if known)</span>
        </label>
        
        <div className="space-y-3">
          {ingredientItems.map((item, index) => (
            <div key={item.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Ingredient {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeIngredientItem(item.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ingredient Name
                  </label>
                  <input
                    type="text"
                    value={item.ingredient_name}
                    onChange={(e) => updateIngredientItem(item.id, 'ingredient_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter ingredient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WEL TWA 8 Hrs
                  </label>
                  <input
                    type="text"
                    value={item.wel_twa_8_hrs}
                    onChange={(e) => updateIngredientItem(item.id, 'wel_twa_8_hrs', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter WEL TWA value"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Workplace Exposure Limit - Time Weighted Average
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    STEL (15 mins)
                  </label>
                  <input
                    type="text"
                    value={item.stel_15_mins}
                    onChange={(e) => updateIngredientItem(item.id, 'stel_15_mins', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter STEL value"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Short Term Exposure Limit
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addIngredientItem}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient Item
          </button>
        </div>
        
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Add ingredient information if available from the safety data sheet. 
            This helps in understanding the specific hazards of individual components.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 3 of 13:</strong> Specify the chemical properties of the substance. 
          Mark whether it's a carcinogen, has skin notation, or is a sensitiser. Add ingredient details if known.
        </p>
      </div>
    </div>
  );
};