import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { InventoryItemComponent } from './InventoryItemComponent';
import type { InventorySectionProps } from '../types/formTypes';

export const InventorySection: React.FC<InventorySectionProps> = ({
  category,
  items,
  isCollapsed,
  itemChecks,
  onToggleSection,
  onItemCheckChange
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
      <button
        type="button"
        onClick={() => onToggleSection(category)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 capitalize">
            {category}
          </h4>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
          {items.length} items
        </span>
      </button>
      
      {!isCollapsed && (
        <div className="p-4 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.map(item => (
              <InventoryItemComponent
                key={item.id}
                item={item}
                itemCheck={itemChecks[item.id]}
                onItemCheckChange={onItemCheckChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
