import React from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, AlertTriangle, Bell } from 'lucide-react';
import { SectionListProps } from '../types';
import { getSectionOverdueCount, getSectionIssuesCount, sectionHasDescriptions, sectionHasSerials, truncateNotes } from '../utils/helpers';
import { formatDateToUK } from '../utils/dateHelpers';

export const SectionList: React.FC<SectionListProps> = ({
  sections,
  actionPlans,
  expandedSections,
  onToggleSection,
  onAddItem,
  onEditItem,
  onDeleteItem
}) => {
  return (
    <div className="mt-6">
      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const sectionCount = actionPlans.filter(plan => plan.section === section).length;
          const overdueCount = getSectionOverdueCount(actionPlans, section);
          const hasOverdue = overdueCount > 0;
          const issuesCount = getSectionIssuesCount(actionPlans, section);
          const hasIssues = issuesCount > 0;
          
          return (
            <div key={section} className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => onToggleSection(section)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium dark:text-white">
                    {section}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    hasOverdue 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {sectionCount}
                  </span>
                  {hasOverdue && (
                    <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  )}
                  {hasIssues && (
                    <Bell className="h-4 w-4 text-yellow-500 dark:text-yellow-400 ml-2" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddItem(section);
                    }}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-400 dark:bg-indigo-900 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Add item to this section"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </button>
                  {expandedSections.has(section) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </button>

              {expandedSections.has(section) && (
                <div className="p-4 bg-white dark:bg-gray-800">
                  {/* Desktop Table */}
                  <div className="hidden lg:block">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider first:rounded-tl-lg">
                              Item
                            </th>
                            {sectionHasDescriptions(actionPlans, section) && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Description
                              </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Type
                            </th>
                            {!['Health Policy Signature', 'Health', 'Training'].includes(section) && sectionHasSerials(actionPlans, section) && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Serials
                              </th>
                            )}
                            {!['Health Policy Signature', 'Health', 'Training'].includes(section) && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Notes
                              </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Last Done
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Interval
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Next Due
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider last:rounded-tr-lg">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {actionPlans
                            .filter((plan) => plan.section === section)
                            .map((plan, index, array) => {
                              const isOverdue = !plan.last_done || (plan.next_due && new Date(plan.next_due) < new Date());
                              return (
                                <tr 
                                  key={plan.id} 
                                  className={`${index === array.length - 1 ? 'last:rounded-b-lg' : ''} ${
                                    isOverdue ? 'bg-red-50 dark:bg-red-900/20' : ''
                                  } hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer`}
                                  onClick={() => onEditItem(plan)}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 first:rounded-bl-lg">
                                    {plan.item}
                                  </td>
                                  {sectionHasDescriptions(actionPlans, section) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                      {plan.description}
                                    </td>
                                  )}
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {plan.type}
                                  </td>
                                  {!['Health Policy Signature', 'Health', 'Training'].includes(section) && sectionHasSerials(actionPlans, section) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                      {plan.serials}
                                    </td>
                                  )}
                                  {!['Health Policy Signature', 'Health', 'Training'].includes(section) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                      {truncateNotes(plan.notes)}
                                    </td>
                                  )}
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {formatDateToUK(plan.last_done)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {plan.interval_months}
                                  </td>
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                    isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-gray-100'
                                  }`}>
                                    {formatDateToUK(plan.next_due)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium last:rounded-br-lg">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditItem(plan);
                                      }}
                                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                      title="Edit"
                                    >
                                      <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteItem(plan.id);
                                      }}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile/Tablet Cards */}
                  <div className="lg:hidden">
                    <div className="space-y-4">
                      {actionPlans
                        .filter((plan) => plan.section === section)
                        .map((plan) => {
                          const isOverdue = !plan.last_done || (plan.next_due && new Date(plan.next_due) < new Date());
                          return (
                            <div 
                              key={plan.id}
                              className={`rounded-lg shadow-md p-4 border ${
                                isOverdue 
                                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                              }`}
                              onClick={() => onEditItem(plan)}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                    {plan.item}
                                  </h4>
                                  {sectionHasDescriptions(actionPlans, section) && plan.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {plan.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                                  <span className="ml-2 text-gray-900 dark:text-white">{plan.type}</span>
                                </div>
                                {!['Health Policy Signature', 'Health', 'Training'].includes(section) && sectionHasSerials(actionPlans, section) && plan.serials && (
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400">Serials:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white">{plan.serials}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Last Done:</span>
                                  <span className="ml-2 text-gray-900 dark:text-white">{formatDateToUK(plan.last_done) || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Interval:</span>
                                  <span className="ml-2 text-gray-900 dark:text-white">{plan.interval_months ? `${plan.interval_months} months` : 'N/A'}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-gray-500 dark:text-gray-400">Next Due:</span>
                                  <span className={`ml-2 ${
                                    isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {formatDateToUK(plan.next_due) || 'N/A'}
                                    {isOverdue && !plan.last_done && <span className="ml-1 text-xs">(Never done)</span>}
                                    {isOverdue && plan.last_done && <span className="ml-1 text-xs">(Overdue)</span>}
                                  </span>
                                </div>
                              </div>

                              {plan.notes && !['Health Policy Signature', 'Health', 'Training'].includes(section) && (
                                <div className="mb-4">
                                  <span className="text-gray-500 dark:text-gray-400 text-sm">Notes:</span>
                                  <p className="text-sm text-gray-900 dark:text-white mt-1">{truncateNotes(plan.notes)}</p>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditItem(plan);
                                  }}
                                  className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteItem(plan.id);
                                  }}
                                  className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      {actionPlans.filter((plan) => plan.section === section).length === 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                          <p className="text-gray-500 dark:text-gray-400">No items in this section</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
