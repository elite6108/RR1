import { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface HSAccidentsActionsProps {
  onBack: () => void;
}

interface Action {
  id: string;
  auto_id: string;
  report_type: string;
  action_title: string;
  due_date: string;
  table_name: string;
  report_id: string;
  action_id: string;
  is_completed: boolean;
  completed_date: string | null;
}

export function HSAccidentsActions({ onBack }: HSAccidentsActionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // List of all accident report tables
  const accidentTables = [
    'accidents_dangerousoccurrence',
    'accidents_environmental',
    'accidents_fatality',
    'accidents_hospitaltreatment',
    'accidents_illhealth',
    'accidents_minoraccident',
    'accidents_nearmiss',
    'accidents_nonfatal',
    'accidents_occupationaldisease',
    'accidents_personalinjury',
    'accidents_propertydamage',
    'accidents_sevendayincapacitation',
    'accidents_specifiedinjuries',
    'accidents_unsafeactions',
    'accidents_unsafeconditions',
    'accidents_utilitydamage'
  ];

  // Fetch actions from all tables
  const fetchActions = async () => {
    setLoading(true);
    setError(null);
    try {
      const allActions: Action[] = [];
      
      for (const table of accidentTables) {
        const { data, error } = await supabase
          .from(table)
          .select('id, auto_id, report_type, actions')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          // Process each report's actions
          data.forEach(report => {
            if (report.actions && Array.isArray(report.actions)) {
              report.actions.forEach((action: any) => {
                allActions.push({
                  id: `${report.id}-${action.id || Math.random()}`,
                  auto_id: report.auto_id,
                  report_type: report.report_type,
                  action_title: action.title || 'Untitled Action',
                  due_date: action.dueDate || 'No due date',
                  table_name: table,
                  report_id: report.id,
                  action_id: action.id || Math.random().toString(),
                  is_completed: false,
                  completed_date: null
                });
              });
            }
          });
        }
      }

      // Fetch completion status for all actions
      const { data: completionData, error: completionError } = await supabase
        .from('report_actions')
        .select('*');

      if (completionError) throw completionError;

      // Update actions with completion status
      if (completionData) {
        allActions.forEach(action => {
          const completion = completionData.find(
            c => c.report_id === action.report_id && 
                 c.report_table === action.table_name && 
                 c.action_id === action.action_id
          );
          if (completion) {
            action.is_completed = completion.is_completed;
            action.completed_date = completion.completed_date;
          }
        });
      }

      setActions(allActions);
    } catch (err) {
      setError('Failed to fetch actions');
      console.error('Error fetching actions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  // Handle action completion toggle
  const handleCompletionToggle = async (action: Action) => {
    try {
      const now = new Date().toISOString();
      const isCompleted = !action.is_completed;

      // Log the data we're trying to send
      console.log('Action data:', {
        report_id: action.report_id,
        report_table: action.table_name,
        action_id: action.action_id,
        is_completed: isCompleted,
        completed_date: isCompleted ? now : null,
        updated_at: now
      });

      // Update or insert completion status
      const { error } = await supabase
        .from('report_actions')
        .upsert({
          report_id: action.report_id.toString(), // Convert to string to ensure it's not a number
          report_table: action.table_name,
          action_id: action.action_id,
          is_completed: isCompleted,
          completed_date: isCompleted ? now : null,
          updated_at: now
        });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      // Update local state
      setActions(actions.map(a => 
        a.id === action.id 
          ? { ...a, is_completed: isCompleted, completed_date: isCompleted ? now : null }
          : a
      ));
    } catch (err) {
      setError('Failed to update action status');
      console.error('Error updating action status:', err);
    }
  };

  // Filter actions based on search query
  const filteredActions = actions.filter((action) => {
    const searchString = searchQuery.toLowerCase();
    return (
      action.action_title.toLowerCase().includes(searchString) ||
      action.report_type.toLowerCase().includes(searchString) ||
      action.auto_id.toLowerCase().includes(searchString) ||
      (action.due_date !== 'No due date' && new Date(action.due_date).toLocaleDateString().toLowerCase().includes(searchString))
    );
  });

  return (
    <div className="container mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Accidents
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Accident Actions</h2>
      </div>

      {/* Search Box */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by action title, report type, ID or due date..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
          {error}
        </div>
      )}

      {/* Table Section */}
      <>
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-lg">
            <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <div className="bg-gray-50 dark:bg-gray-700">
                <div className="grid grid-cols-12 py-3.5 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-2">REPORT TYPE</div>
                  <div className="col-span-3">ACTION TITLE</div>
                  <div className="col-span-2">DUE DATE</div>
                  <div className="col-span-2">COMPLETED DATE</div>
                  <div className="col-span-1">ACTIONS</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading actions...</div>
                ) : filteredActions.length > 0 ? (
                  filteredActions.map((action) => (
                    <div key={action.id} className="grid grid-cols-12 py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100">{action.auto_id}</div>
                      <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100">{action.report_type}</div>
                      <div className="col-span-3 text-sm text-gray-900 dark:text-gray-100">{action.action_title}</div>
                      <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                        {action.due_date !== 'No due date' ? new Date(action.due_date).toLocaleDateString() : 'No due date'}
                      </div>
                      <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                        {action.completed_date ? new Date(action.completed_date).toLocaleDateString() : '-'}
                      </div>
                      <div className="col-span-1 text-sm text-gray-900 dark:text-gray-100">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={action.is_completed}
                            onChange={() => handleCompletionToggle(action)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">No actions found</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden">
          <div className="space-y-4">
            {loading ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">Loading actions...</p>
              </div>
            ) : filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <div 
                  key={action.id}
                  className={`rounded-lg shadow-md p-4 border ${
                    action.is_completed 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                        {action.action_title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ID: {action.auto_id} • {action.report_type}
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={action.is_completed}
                          onChange={() => handleCompletionToggle(action)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
                      <span className={`${
                        action.due_date !== 'No due date' && new Date(action.due_date) < new Date() && !action.is_completed
                          ? 'text-red-600 dark:text-red-400 font-medium' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {action.due_date !== 'No due date' ? new Date(action.due_date).toLocaleDateString() : 'No due date'}
                        {action.due_date !== 'No due date' && new Date(action.due_date) < new Date() && !action.is_completed && (
                          <span className="ml-1 text-xs">(Overdue)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Completed:</span>
                      <span className="text-gray-900 dark:text-white">
                        {action.completed_date ? new Date(action.completed_date).toLocaleDateString() : 'Not completed'}
                      </span>
                    </div>
                    {action.is_completed && (
                      <div className="flex justify-center pt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          ✓ Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No actions found</p>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
}