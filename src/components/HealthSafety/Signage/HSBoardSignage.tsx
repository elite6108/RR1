import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Search,
  AlertTriangle,
  X,
  Loader2,
} from 'lucide-react';
import { HSBoardSignageModal } from './HSBoardSignageModal';
import { supabase } from '../../../lib/supabase';
import { generateBoardSignagePDF } from '../../../utils/pdf/boardsignage/boardsignagePDFGenerator';

interface HSBoardSignageProps {
  onBack: () => void;
}

interface BoardData {
  id: string;
  title: string;
  size: string;
  orientation: string;
  status: string;
  site: string;
  site_name: string;
  signs: Array<{ artworkId: string; code: string }>;
  text: Record<string, { useDefaultText: boolean; customText?: string }>;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function HSBoardSignage({ onBack }: HSBoardSignageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<BoardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [editingBoard, setEditingBoard] = useState<BoardData | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<BoardData | null>(null);
  const [pdfGeneratingId, setPdfGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const { data, error } = await supabase
        .from('signage_board')
        .select(`
          id, 
          title, 
          size, 
          orientation, 
          status, 
          site, 
          signs, 
          text, 
          created_at, 
          updated_at, 
          created_by,
          sites!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform the data to include site_name
        const transformedData = data.map(board => ({
          ...board,
          site_name: board.sites?.name || 'Unknown Site'
        }));
        setBoards(transformedData);
        setFilteredData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(boards);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = boards.filter(board => 
        board.title.toLowerCase().includes(lowercaseQuery) || 
        board.status.toLowerCase().includes(lowercaseQuery) ||
        board.size.toLowerCase().includes(lowercaseQuery) ||
        board.site_name.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, boards]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSaveBoard = (data: {
    id: string;
    title: string;
    size: string;
    orientation: string;
    status: string;
    site: string;
    signs: Array<{ artworkId: string; code: string }>;
    text: Record<string, { useDefaultText: boolean; customText?: string }>;
  }) => {
    // Refresh the boards list
    fetchBoards();
    setIsModalOpen(false);
    setEditingBoard(null);
  };

  const handleEditBoard = (board: BoardData) => {
    setEditingBoard(board);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (board: BoardData) => {
    setBoardToDelete(board);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!boardToDelete) return;

    try {
      const { error } = await supabase
        .from('signage_board')
        .delete()
        .eq('id', boardToDelete.id);

      if (error) throw error;

      // Refresh the boards list
      fetchBoards();
      setIsDeleteModalOpen(false);
      setBoardToDelete(null);
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handleAddBoard = () => {
    setEditingBoard(null);
    setIsModalOpen(true);
  };

  const handleGeneratePDF = async (board: BoardData) => {
    try {
      setPdfGeneratingId(board.id);
      await generateBoardSignagePDF(board);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setPdfGeneratingId(null);
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Signage Management
        </button>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Board Signage</span>
      </div>
      
      {/* Page Title and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Board Signage</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleAddBoard}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Board
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md w-full mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search by title, status, size, or site"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Orientation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {filteredData.map((board) => (
              <tr key={board.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {board.site_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(board.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {board.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {board.orientation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditBoard(board)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen h-5 w-5">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleGeneratePDF(board)}
                      disabled={pdfGeneratingId === board.id}
                      className={`${
                        pdfGeneratingId === board.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                      }`}
                      title="View PDF"
                    >
                      {pdfGeneratingId === board.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-5 w-5">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(board)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      aria-label="Delete"
                      title="Delete Board"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No board signage found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Delete Board
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{boardToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <HSBoardSignageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBoard(null);
        }}
        onSave={handleSaveBoard}
        editData={editingBoard}
      />
    </>
  );
}