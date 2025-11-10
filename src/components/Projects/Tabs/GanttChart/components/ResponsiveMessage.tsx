import React from 'react';

export function ResponsiveMessage() {
  return (
    <div className="block lg:hidden text-center p-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-900">
      <h3 className="text-lg font-medium text-amber-800 dark:text-amber-200 mb-2">
        Please view on another device
      </h3>
      <p className="text-amber-700 dark:text-amber-300">
        For the best viewing experience of the Gantt chart, please use a desktop computer. Alternatively, a laptop or tablet in landscape mode will also provide acceptable viewing.
      </p>
    </div>
  );
}
