import React from 'react';
import { Activity, ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Lead, SortField, SortDirection } from '../../shared/types';
import { STATUS_COLORS, STATUS_ORDER, PRIORITY_ORDER } from '../../shared/constants';
import { formatDate, formatCurrency, getStatusDisplayText, getPriority, getPriorityColor } from '../../shared/utils';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  searchTerm: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onRowClick: (lead: Lead, event: React.MouseEvent) => void;
  onActivityClick: (leadId: string, event: React.MouseEvent) => void;
  onEditClick: (lead: Lead, event: React.MouseEvent) => void;
  onDeleteClick: (lead: Lead, event: React.MouseEvent) => void;
}

export function LeadTable({
  leads,
  loading,
  searchTerm,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
  onActivityClick,
  onEditClick,
  onDeleteClick
}: LeadTableProps) {
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'email':
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case 'phone':
        aValue = a.phone;
        bValue = b.phone;
        break;
      case 'budget':
        aValue = parseFloat(a.budget || '0');
        bValue = parseFloat(b.budget || '0');
        break;
      case 'priority':
        aValue = PRIORITY_ORDER[getPriority(a) as keyof typeof PRIORITY_ORDER] || 0;
        bValue = PRIORITY_ORDER[getPriority(b) as keyof typeof PRIORITY_ORDER] || 0;
        break;
      case 'status':
        aValue = STATUS_ORDER[a.status] || 0;
        bValue = STATUS_ORDER[b.status] || 0;
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> : 
      <ChevronDown className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => onSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Company / Name</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => onSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Contact</span>
                    {renderSortIcon('email')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => onSort('budget')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Budget</span>
                    {renderSortIcon('budget')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => onSort('priority')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority</span>
                    {renderSortIcon('priority')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => onSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => onSort('created_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created Date</span>
                    {renderSortIcon('created_at')}
                  </div>
                </th>
                <th className="sticky top-0 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No leads found matching your search.' : 'No leads found.'}
                  </td>
                </tr>
              ) : (
                sortedLeads.map(lead => {
                  const priority = getPriority(lead);
                  return (
                    <tr 
                      key={lead.id}
                      onClick={(e) => onRowClick(lead, e)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{lead.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatCurrency(lead.budget || '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPriorityColor(priority)}`}>
                          {priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                          {getStatusDisplayText(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={(e) => onActivityClick(lead.id, e)} 
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="View Activity"
                          >
                            <Activity className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={(e) => onEditClick(lead, e)} 
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Edit Lead"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={(e) => onDeleteClick(lead, e)} 
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
