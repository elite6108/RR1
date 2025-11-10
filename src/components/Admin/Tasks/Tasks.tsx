import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { ChevronLeft, Plus } from 'lucide-react';
import { TasksProps, Task, Board, TaskFormData } from './types';
import { filterTasks, getSignedFileUrl } from './utils';
import {
  useBoards,
  useTasks,
  useProjects,
  useStaff,
  useUsers,
  useCombinedStaffUsers,
  useTaskMessages,
  useAuth,
} from './hooks';
import {
  TaskStatistics,
  BoardModal,
  DeleteConfirmModal,
  TaskModal,
  TaskBoard,
  TaskListView,
  TaskSummaryView,
} from './components';

export function Tasks({ setShowTasks, setShowAdminDashboard }: TasksProps) {
  // State management
  const [expandedBoards, setExpandedBoards] = useState<Set<number>>(new Set());
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [showTaskSummary, setShowTaskSummary] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [activeBoardTabs, setActiveBoardTabs] = useState<Record<number, 'open' | 'completed'>>({});
  const [activeTab, setActiveTab] = useState<'info' | 'notes' | 'attachments' | 'chat'>('info');
  const [newMessage, setNewMessage] = useState('');

  // Form data states
  const [boardFormData, setBoardFormData] = useState({
    name: '',
    description: '',
    border_color: '#FF0000',
  });

  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'to_schedule' as Task['status'],
    priority: 'medium' as Task['priority'],
    project_id: null,
    board_id: null,
    notes: '',
    tags: [],
    staff_ids: [],
    attachments: [],
    existing_attachments: [],
    due_date: '',
    cost: null,
    category: 'Quote',
  });

  // Custom hooks
  const { boards, fetchBoards, createBoard, updateBoard, deleteBoard } = useBoards();
  const { tasks, fetchTasks, deleteTask } = useTasks();
  const { projects, fetchProjects } = useProjects();
  const { staff, fetchStaff } = useStaff();
  const { users, fetchUsers } = useUsers();
  const { combinedStaffUsers } = useCombinedStaffUsers(staff, users);
  const { messages, sendMessage, saveMessages } = useTaskMessages(editingTask?.id || null, activeTab === 'chat');
  const { user } = useAuth();

  // Initialize data
  useEffect(() => {
    fetchBoards();
    fetchTasks();
    fetchProjects();
    fetchStaff();
    fetchUsers();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showBoardModal || showTaskModal || showDeleteModal || showDeleteTaskModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBoardModal, showTaskModal, showDeleteModal, showDeleteTaskModal]);

  // Board management functions
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createBoard(boardFormData);
    if (success) {
      setShowBoardModal(false);
      setBoardFormData({ name: '', description: '', border_color: '#FF0000' });
    }
  };

  const handleEditBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBoard) return;

    const success = await updateBoard(editingBoard.id, boardFormData);
    if (success) {
      setShowBoardModal(false);
      setEditingBoard(null);
      setBoardFormData({ name: '', description: '', border_color: '#FF0000' });
    }
  };

  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;

    const success = await deleteBoard(boardToDelete.id);
    if (success) {
      setShowDeleteModal(false);
      setBoardToDelete(null);
    }
  };

  const handleDeleteTask = async () => {
    if (!editingTask) return;

    const success = await deleteTask(editingTask.id);
    if (success) {
      setShowDeleteTaskModal(false);
      setEditingTask(null);
    }
  };

  // Task management functions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Handle file uploads first
      const uploadedFiles = await Promise.all(
        taskFormData.attachments.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('task-attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const signedUrl = await getSignedFileUrl(fileName);
          return {
            file_name: fileName,
            file_url: signedUrl || '',
            file_type: file.type,
            display_name: file.name,
          };
        })
      );

      const taskData = {
        title: taskFormData.title,
        description: taskFormData.description || null,
        status: taskFormData.status,
        priority: taskFormData.priority,
        project_id: taskFormData.project_id,
        board_id: taskFormData.board_id,
        notes: taskFormData.notes || null,
        tags: taskFormData.tags,
        staff_ids: taskFormData.staff_ids,
        due_date: taskFormData.due_date || null,
        cost: taskFormData.cost,
        category: taskFormData.category,
      };

      if (editingTask) {
        // Update existing task
        const { error: updateError } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingTask.id);

        if (updateError) throw updateError;

        // Handle new attachments
        if (uploadedFiles.length > 0) {
          const newAttachmentData = uploadedFiles.map((file) => ({
            task_id: editingTask.id,
            ...file,
          }));
          const { error: newAttachmentError } = await supabase
            .from('task_attachments')
            .insert(newAttachmentData);
          if (newAttachmentError) throw newAttachmentError;
        }

        // Handle removed attachments
        const originalAttachments = editingTask.attachments || [];
        const remainingAttachmentIds = new Set(
          taskFormData.existing_attachments.map((a) => a.id)
        );
        const attachmentsToRemove = originalAttachments.filter(
          (a) => !remainingAttachmentIds.has(a.id)
        );

        if (attachmentsToRemove.length > 0) {
          // Delete from task_attachments table
          const idsToRemove = attachmentsToRemove.map((a) => a.id);
          const { error: deleteDbError } = await supabase
            .from('task_attachments')
            .delete()
            .in('id', idsToRemove);
          if (deleteDbError) throw deleteDbError;

          // Delete from storage
          const fileNamesToRemove = attachmentsToRemove.map((a) => a.file_name);
          const { error: deleteStorageError } = await supabase.storage
            .from('task-attachments')
            .remove(fileNamesToRemove);
          if (deleteStorageError) {
             // Log error but don't block, as the DB link is already removed
            console.error('Error deleting files from storage:', deleteStorageError);
          }
        }

      } else {
        // Create new task
        const { data: newTask, error } = await supabase
          .from('tasks')
          .insert([taskData])
          .select()
          .single();

        if (error) throw error;

        // Add attachments for new task
        if (uploadedFiles.length > 0) {
          const attachmentData = uploadedFiles.map((file) => ({
            task_id: newTask.id,
            ...file,
          }));

          const { error: attachmentError } = await supabase
            .from('task_attachments')
            .insert(attachmentData);

          if (attachmentError) throw attachmentError;
        }

        // Save any draft messages for the new task
        await saveMessages(newTask.id);
      }

      // Reset form and close modal
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskFormData({
        title: '',
        description: '',
        status: 'to_schedule',
        priority: 'medium',
        project_id: null,
        board_id: null,
        notes: '',
        tags: [],
        staff_ids: [],
        attachments: [],
        existing_attachments: [],
        due_date: '',
        cost: null,
        category: null,
      });
      setActiveTab('info');
      
      // Refresh tasks
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    const success = await sendMessage(
      newMessage,
      user.id,
      user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Unknown User'
    );

    if (success) {
      setNewMessage('');
    }
  };

  // Helper functions
  const toggleBoardExpansion = (boardId: number) => {
    setExpandedBoards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(boardId)) {
        newSet.delete(boardId);
      } else {
        newSet.add(boardId);
      }
      return newSet;
    });
  };

  const setActiveBoardTab = (boardId: number, tab: 'open' | 'completed') => {
    setActiveBoardTabs((prev) => ({ ...prev, [boardId]: tab }));
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setTaskFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      project_id: task.project_id,
      board_id: task.board_id,
      notes: task.notes || '',
      tags: task.tags,
      staff_ids: task.staff_ids,
      attachments: [],
      existing_attachments: task.attachments || [],
      due_date: task.due_date || '',
      cost: task.cost,
      category: task.category,
    });
    setShowTaskModal(true);
  };

  const handleTaskView = (task: Task) => {
    setViewingTask(task);
    setShowTaskSummary(true);
  };

  const handleAddBoard = () => {
    setEditingBoard(null);
    setBoardFormData({
      name: '',
      description: '',
      border_color: '#FF0000',
    });
    setShowBoardModal(true);
  };

  const handleEditBoardClick = (board: Board) => {
    setEditingBoard(board);
    setBoardFormData({
      name: board.name,
      description: board.description || '',
      border_color: board.border_color || '#FF0000',
    });
    setShowBoardModal(true);
  };

  const handleAddTask = (status: Task['status']) => {
    setEditingTask(null);
    setTaskFormData({
      ...taskFormData,
      status,
    });
    setShowTaskModal(true);
  };

  const handleRemoveFile = (index: number) => {
    setTaskFormData({
      ...taskFormData,
      attachments: taskFormData.attachments.filter((_, i) => i !== index),
    });
  };

  const handleRemoveExistingAttachment = (index: number) => {
    setTaskFormData({
      ...taskFormData,
      existing_attachments: taskFormData.existing_attachments.filter((_, i) => i !== index),
    });
  };

  // Filter tasks based on search query
  const filteredTasks = filterTasks(tasks, searchQuery, boards);

  return (
    <div>
      {/* 1. Title and Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={() => {
            setShowTasks(false);
            setShowAdminDashboard(true);
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Company Section
        </button>
      </div>

      {/* 2. Title */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Company Tasks</h2>
      
      {/* 3. Paragraph */}
      <p className="text-gray-600 dark:text-gray-300 mb-6">Use this for company tasks, or to assign tasks to other users. For personal tasks, use the To Do List instead.</p>

      {/* 4. Statistics */}
      <TaskStatistics tasks={filteredTasks} />

      {/* 5. Search bar with inline View buttons and Add Board */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks by title, tags, or board name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-white">
                View:
              </span>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md ${
                    viewMode === 'list'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-blue-600 dark:hover:text-white'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md ${
                    viewMode === 'kanban'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-blue-600 dark:hover:text-white'
                  }`}
                >
                  Kanban
                </button>
              </div>
            </div>
            <button
              onClick={handleAddBoard}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Board
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' && (
        <TaskBoard
          boards={boards}
          tasks={filteredTasks}
          staff={staff}
          combinedStaffUsers={combinedStaffUsers}
          expandedBoards={expandedBoards}
          activeBoardTabs={activeBoardTabs}
          onTaskClick={handleTaskClick}
          onTaskView={handleTaskView}
          onDeleteTaskClick={(task: Task) => {
            setEditingTask(task);
            setShowDeleteTaskModal(true);
          }}
          onAddTaskClick={handleAddTask}
          onToggleBoardExpansion={toggleBoardExpansion}
          onSetActiveBoardTab={setActiveBoardTab}
        />
      )}

      {viewMode === 'list' && (
        <TaskListView
          boards={boards}
          tasks={filteredTasks}
          staff={staff}
          combinedStaffUsers={combinedStaffUsers}
          expandedBoards={expandedBoards}
          activeBoardTabs={activeBoardTabs}
          onTaskClick={handleTaskClick}
          onTaskView={handleTaskView}
          onDeleteTaskClick={(task: Task) => {
            setEditingTask(task);
            setShowDeleteTaskModal(true);
          }}
          onAddTaskClick={handleAddTask}
          onEditBoard={handleEditBoardClick}
          onToggleBoardExpansion={toggleBoardExpansion}
          onSetActiveBoardTab={setActiveBoardTab}
        />
      )}

      {/* Modals */}
      <BoardModal
        showBoardModal={showBoardModal}
        editingBoard={editingBoard}
        boardFormData={boardFormData}
        setBoardFormData={setBoardFormData}
        onSubmit={editingBoard ? handleEditBoard : handleCreateBoard}
        onClose={() => {
          setShowBoardModal(false);
          setEditingBoard(null);
        }}
      />

      <DeleteConfirmModal
        showDeleteModal={showDeleteModal}
        showDeleteTaskModal={showDeleteTaskModal}
        boardToDelete={boardToDelete}
        taskToDelete={editingTask}
        onDeleteBoard={handleDeleteBoard}
        onDeleteTask={handleDeleteTask}
        onClose={() => {
          setShowDeleteModal(false);
          setShowDeleteTaskModal(false);
          setBoardToDelete(null);
          setEditingTask(null);
        }}
      />

      <TaskModal
        showTaskModal={showTaskModal}
        editingTask={editingTask}
        taskFormData={taskFormData}
        setTaskFormData={setTaskFormData}
        boards={boards}
        projects={projects}
        combinedStaffUsers={combinedStaffUsers}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSendMessage={handleSendMessage}
        onRemoveFile={handleRemoveFile}
        onRemoveExistingAttachment={handleRemoveExistingAttachment}
      />

      {/* Task Summary View */}
      {showTaskSummary && viewingTask && (
        <TaskSummaryView
          task={viewingTask}
          staff={staff}
          combinedStaffUsers={combinedStaffUsers}
          onClose={() => {
            setShowTaskSummary(false);
            setViewingTask(null);
          }}
        />
      )}
    </div>
  );
}
