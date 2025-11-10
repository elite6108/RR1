// Custom styles for the Gantt chart components
export const ganttStyles = `
  /* Style container */
  .wx-toolbar {
    padding: 8px;
    display: flex;
    gap: 8px;
  }

  /* Weekend highlighting */
  .sday {
    background-color: rgba(243, 244, 246, 0.5); /* light gray with transparency */
  }

  @media (prefers-color-scheme: dark) {
    .sday {
      background-color: rgba(55, 65, 81, 0.5); /* dark gray with transparency */
    }
  }

  /* Style the Edit button */
  [data-id="edit-task"] .wx-button {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #374151; /* text-gray-700 */
    background-color: #f3f4f6; /* bg-gray-100 */
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  [data-id="edit-task"] .wx-button:hover {
    background-color: #e5e7eb; /* hover:bg-gray-200 */
  }

  /* Style the Delete button */
  [data-id="delete-task"] .wx-button {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    background-color: #dc2626;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  [data-id="delete-task"] .wx-button:hover {
    background-color: #b91c1c;
  }

  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    [data-id="edit-task"] .wx-button {
      color: #e5e7eb; /* dark:text-gray-200 */
      background-color: #374151; /* dark:bg-gray-700 */
    }

    [data-id="edit-task"] .wx-button:hover {
      background-color: #4b5563; /* dark:hover:bg-gray-600 */
    }

    [data-id="delete-task"] .wx-button:hover {
      background-color: #991b1b;
    }
  }
`;
