import { supabase } from '../../../../lib/supabase';
import { Task, Board } from '../types';

// Helper function to generate consistent user ID hash
export const getUserIdHash = (userId: string): number => {
  const hash = Math.abs(userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));
  return -hash; // Return negative to distinguish from staff IDs
};

// Function to get signed file URL for task attachments
export const getSignedFileUrl = async (fileName: string): Promise<string | null> => {
  if (!fileName) return null;
  
  try {
    const { data } = await supabase.storage
      .from('task-attachments')
      .createSignedUrl(fileName, 3600); // 1 hour expiry
    
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

// Filter tasks based on search query
export const filterTasks = (tasks: Task[], searchQuery: string, boards: Board[]) => {
  if (!searchQuery) return tasks;

  const query = searchQuery.toLowerCase();
  return tasks.filter((task) => {
    const board = boards.find((b) => b.id === task.board_id);
    const matchesBoard = board && board.name.toLowerCase().includes(query);
    const matchesTask =
      task.title.toLowerCase().includes(query) ||
      task.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesBoard || matchesTask;
  });
};

// Check if board should be shown based on search query
export const shouldShowBoard = (board: Board, searchQuery: string, tasks: Task[]) => {
  if (!searchQuery) return true;
  const query = searchQuery.toLowerCase();
  return (
    board.name.toLowerCase().includes(query) ||
    tasks.some(
      (task) =>
        task.board_id === board.id &&
        (task.title.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query)))
    )
  );
};
