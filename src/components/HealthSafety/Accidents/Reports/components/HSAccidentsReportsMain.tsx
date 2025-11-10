import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Search, Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { HSAccidentsReportsModals } from './HSAccidentsReportsModals';
import { handleGeneratePDF } from '../utils/pdfUtils';
import { HSAccidentsReportsProps, Report, accidentTables, formOptions } from '../types';

export function HSAccidentsReportsMain({ onBack }: HSAccidentsReportsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('accident');
  const [selectedFormType, setSelectedFormType] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedReportData, setSelectedReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Fetch reports from all tables
  const fetchReports = async () => {
    console.log('Fetching reports from database...');
    setLoading(true);
    setError(null);
    try {
      const allReports: Report[] = [];
      const processedIds = new Set();
      
      for (const table of accidentTables) {
        const { data, error } = await supabase
          .from(table)
          .select('id, auto_id, report_type, category, created_at, incident_date')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          data.forEach((report: any) => {
            // Use a unique identifier that combines table and id to avoid conflicts
            const uniqueId = `${table}_${report.id}`;
            
            // Only use auto_id for deduplication if it exists and is not empty
            const dedupeKey = report.auto_id && report.auto_id.trim() !== '' ? report.auto_id : uniqueId;
            
            if (!processedIds.has(dedupeKey)) {
              processedIds.add(dedupeKey);
              allReports.push({
                ...report,
                table_name: table
              });
            }
          });
        }
      }

      console.log(`Fetched ${allReports.length} reports total`);
      setReports(allReports);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter reports based on search query
  const filteredReports = reports.filter((report) => {
    const searchString = searchQuery.toLowerCase();
    return (
      report.report_type.toLowerCase().includes(searchString) ||
      report.category.toLowerCase().includes(searchString) ||
      (report.auto_id && report.auto_id.toLowerCase().includes(searchString)) ||
      new Date(report.created_at).toLocaleDateString().toLowerCase().includes(searchString)
    );
  });

  // Debug logging
  console.log(`Total reports: ${reports.length}, Filtered reports: ${filteredReports.length}, Search query: "${searchQuery}"`);

  // Handle PDF generation
  const onGeneratePDF = async (report: Report) => {
    await handleGeneratePDF(report, setGeneratingPdfId, setError, setPdfError);
  };

  // Handle delete report
  const handleDelete = async () => {
    if (!selectedReport) return;

    try {
      console.log('Deleting report:', selectedReport);
      console.log('Table:', selectedReport.table_name, 'ID:', selectedReport.id);

      const { data: deletedData, error } = await supabase
        .from(selectedReport.table_name)
        .delete()
        .eq('id', selectedReport.id)
        .select();

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Delete operation result:', deletedData);

      console.log('Report deleted successfully from database');

      // Close modal first
      setShowDeleteModal(false);
      setSelectedReport(null);

      // Refresh the reports list from the database instead of just updating local state
      await fetchReports();
      
      console.log('Reports list refreshed after delete');
    } catch (err) {
      setError('Failed to delete report');
      console.error('Error deleting report:', err);
    }
  };

  // Define columns for each table type (excluding columns that don't exist)
  const getTableColumns = (tableName: string): string => {
    if (tableName === 'accidents_utilitydamage') {
      // Utility damage table doesn't have basic_cause_of_incident column
      return `id, auto_id, report_type, category, incident_location, incident_date, 
              incident_description, source_of_hazard, root_cause_work_environment, 
              root_cause_human_factors, root_cause_ppe, root_cause_management, 
              root_cause_plant_equipment, actions_taken, actions, damage_details, 
              cost_estimate, utility_company, reference_number, file_urls, created_at`;
    }
    // For other tables, use * to get all columns
    return '*';
  };

  // Handle edit report
  const handleEdit = async (report: Report) => {
    try {
      console.log('Editing report:', report);
      console.log('Table name:', report.table_name);
      console.log('Report ID:', report.id);

      // Fetch the complete record data from the specific table
      const { data, error } = await supabase
        .from(report.table_name)
        .select(getTableColumns(report.table_name))
        .eq('id', report.id)
        .single();

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      console.log('Fetched data:', data);

      if (data) {
        // Convert snake_case to camelCase for form fields
        const formattedData = Object.entries(data).reduce((acc: any, [key, value]) => {
          // Convert snake_case to camelCase
          const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          acc[camelKey] = value;
          return acc;
        }, {});

        console.log('Formatted data:', formattedData);

        setSelectedReport(report);
        setSelectedReportData(formattedData);
        setSelectedFormType(report.table_name.replace('accidents_', ''));
        setShowFormModal(true);
      }
    } catch (err) {
      console.error('Error in handleEdit:', err);
      setError('Failed to fetch report data');
    }
  };

  const handleFormSelect = (formType: string) => {
    setSelectedFormType(formType);
    setShowFormModal(true);
    setShowAddModal(false);
  };

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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Accident Reports</h2>
      </div>

      {/* Search Box with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by report type, category, ID or date..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Report
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {/* PDF Error Message */}
      {pdfError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
          {pdfError}
        </div>
      )}

      {/* Table Section */}
      <>
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Report Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Incident Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">Loading reports...</td>
                  </tr>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr 
                      key={report.id} 
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleEdit(report)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{report.auto_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {report.incident_date ? new Date(report.incident_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{report.report_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{report.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(report);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onGeneratePDF(report);
                          }}
                          disabled={generatingPdfId === report.id}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          title="View PDF"
                        >
                          {generatingPdfId === report.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">No reports found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden">
          <div className="space-y-4">
            {loading ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">Loading reports...</p>
              </div>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div 
                  key={report.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                        ID: {report.auto_id}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {report.report_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Report Date:</span>
                      <span className="text-gray-900 dark:text-white">{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Incident Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {report.incident_date ? new Date(report.incident_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <span className="text-gray-900 dark:text-white">{report.category}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(report);
                      }}
                      className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGeneratePDF(report);
                      }}
                      disabled={generatingPdfId === report.id}
                      className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md disabled:opacity-50"
                      title="View PDF"
                    >
                      {generatingPdfId === report.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No reports found</p>
              </div>
            )}
          </div>
        </div>
      </>

      <HSAccidentsReportsModals
        showAddModal={showAddModal}
        showFormModal={showFormModal}
        showDeleteModal={showDeleteModal}
        activeTab={activeTab}
        selectedFormType={selectedFormType}
        selectedReport={selectedReport}
        selectedReportData={selectedReportData}
        formOptions={formOptions}
        onCloseAddModal={() => setShowAddModal(false)}
        onCloseFormModal={() => {
          setShowFormModal(false);
          setSelectedReport(null);
          setSelectedReportData(null);
          fetchReports();
        }}
        onCloseDeleteModal={() => {
          setShowDeleteModal(false);
          setSelectedReport(null);
        }}
        onSetActiveTab={setActiveTab}
        onFormSelect={handleFormSelect}
        onDelete={handleDelete}
        fetchReports={fetchReports}
      />
    </div>
  );
}
