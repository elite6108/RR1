import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Board, Task, Project, StaffMember, User, CombinedStaffUser, TaskAttachment, Message } from '../types';
import { getSignedFileUrl } from '../utils';

// Hook for managing boards
export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  const fetchBoards = async () => {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching boards:', error);
      return;
    }

    setBoards(data || []);
  };

  const createBoard = async (boardData: { name: string; description: string; border_color: string }) => {
    try {
      const { error } = await supabase.from('boards').insert([
        {
          ...boardData,
          sort_order: boards.length,
        },
      ]);

      if (error) throw error;
      await fetchBoards();
      return true;
    } catch (error) {
      console.error('Error creating board:', error);
      return false;
    }
  };

  const updateBoard = async (boardId: number, boardData: { name: string; description: string; border_color: string }) => {
    try {
      const { error } = await supabase
        .from('boards')
        .update(boardData)
        .eq('id', boardId);

      if (error) throw error;
      await fetchBoards();
      return true;
    } catch (error) {
      console.error('Error updating board:', error);
      return false;
    }
  };

  const deleteBoard = async (boardId: number) => {
    try {
      const { error } = await supabase.from('boards').delete().eq('id', boardId);
      if (error) throw error;
      await fetchBoards();
      return true;
    } catch (error) {
      console.error('Error deleting board:', error);
      return false;
    }
  };

  return {
    boards,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
  };
};

// Hook for managing tasks
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select(
        `
          *,
          task_attachments(*)
        `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    // Process tasks to generate signed URLs for attachments
    if (data && data.length > 0) {
      const tasksWithSignedUrls = await Promise.all(
        data.map(async (task) => {
          if (task.attachments && task.attachments.length > 0) {
            const attachmentsWithSignedUrls = await Promise.all(
              task.attachments.map(async (attachment: TaskAttachment) => {
                const signedUrl = await getSignedFileUrl(attachment.file_name);
                return {
                  ...attachment,
                  file_url: signedUrl || attachment.file_url
                };
              })
            );
            return { ...task, attachments: attachmentsWithSignedUrls };
          }
          if (task.task_attachments && task.task_attachments.length > 0) {
            const attachmentsWithSignedUrls = await Promise.all(
              task.task_attachments.map(async (attachment: TaskAttachment) => {
                const signedUrl = await getSignedFileUrl(attachment.file_name);
                return {
                  ...attachment,
                  file_url: signedUrl || attachment.file_url
                };
              })
            );
            return { ...task, attachments: attachmentsWithSignedUrls, task_attachments: undefined };
          }
          return task;
        })
      );
      setTasks(tasksWithSignedUrls);
    } else {
      setTasks([]);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      await fetchTasks();
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  return {
    tasks,
    fetchTasks,
    deleteTask,
  };
};

// Hook for managing projects
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    setProjects(data || []);
  };

  return {
    projects,
    fetchProjects,
  };
};

// Hook for managing staff
export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, position')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching staff:', error);
      return;
    }

    setStaff(data || []);
  };

  return {
    staff,
    fetchStaff,
  };
};

// Hook for managing users
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching all verified users via Edge Function...');
      
      // Get current session to pass authorization header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('No valid session found');
        setUsers([]);
        return;
      }

      // Call the Edge Function to get all verified users
      const { data, error } = await supabase.functions.invoke('get-all-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        // Fallback to current user only if Edge Function fails
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUsers([{
            id: user.id,
            full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
            email: user.email || ''
          }]);
          console.log('Fallback: Using current authenticated user only:', user.email);
        } else {
          setUsers([]);
        }
        return;
      }

      if (data?.users) {
        setUsers(data.users.map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          email: user.email
        })));
        console.log(`Successfully fetched ${data.users.length} verified users:`, data.users.map((u: any) => u.email));
      } else {
        console.log('No users returned from Edge Function');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to current user only if there's an error
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUsers([{
            id: user.id,
            full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
            email: user.email || ''
          }]);
          console.log('Error fallback: Using current authenticated user only:', user.email);
        } else {
          setUsers([]);
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setUsers([]);
      }
    }
  };

  return {
    users,
    fetchUsers,
  };
};

// Hook for combining staff and users
export const useCombinedStaffUsers = (staff: StaffMember[], users: User[]) => {
  const [combinedStaffUsers, setCombinedStaffUsers] = useState<CombinedStaffUser[]>([]);

  const combineStaffAndUsers = () => {
    const combined: CombinedStaffUser[] = [
      // Add staff members
      ...staff.map(staffMember => ({
        id: `staff_${staffMember.id}`,
        name: staffMember.name,
        type: 'staff' as const,
        original_id: staffMember.id,
        email: '', // Staff table doesn't have email in this interface
        position: staffMember.position
      })),
      // Add users from profiles, but exclude those who already exist as staff
      ...users.filter(user => !staff.some(staffMember => staffMember.name.toLowerCase().includes(user.full_name.toLowerCase()) || user.full_name.toLowerCase().includes(staffMember.name.toLowerCase())))
        .map(user => ({
          id: `user_${user.id}`,
          name: user.full_name || user.email || 'Unknown User',
          type: 'user' as const,
          original_id: user.id,
          email: user.email
        }))
    ];
    
    console.log('Combined staff and users for tasks:', combined);
    setCombinedStaffUsers(combined);
  };

  useEffect(() => {
    // Combine staff and users when either list changes
    if (staff.length > 0 || users.length > 0) {
      combineStaffAndUsers();
    }
  }, [staff, users]);

  return {
    combinedStaffUsers,
    combineStaffAndUsers,
  };
};

// Hook for managing task messages
export const useTaskMessages = (taskId: number | null, isActive: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Clear messages when inactive or for new tasks
    if (!isActive || !taskId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from('task_messages')
          .select('*')
          .eq('task_id', taskId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          return;
        }

        setMessages(messagesData || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to new messages only for existing tasks
    const subscription = supabase
      .channel(`task_messages:${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_messages',
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev: Message[]) => [
              ...prev,
              payload.new as Message,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [taskId, isActive]);

  const sendMessage = async (message: string, userId: string, userName: string) => {
    if (!message.trim()) return false;

    const newMessage: Message = {
      id: Date.now(), // Temporary ID
      task_id: taskId || 0,
      user_id: userId,
      user_name: userName,
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);

    if (taskId) {
      // If task exists, save message to DB immediately
      try {
        const { error } = await supabase
          .from('task_messages')
          .insert([
            {
              task_id: taskId,
              user_id: userId,
              user_name: userName,
              message: message.trim(),
            },
          ]);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove optimistic message if DB save fails
        setMessages(prev => prev.filter(m => m.id !== newMessage.id));
        return false;
      }
    }
    
    return true; // For new tasks, message is only added to local state
  };

  const saveMessages = async (newTaskId: number) => {
    const draftMessages = messages.filter(m => m.task_id === 0);
    if (draftMessages.length === 0) return true;

    try {
      const messagesToSave = draftMessages.map(msg => ({
        task_id: newTaskId,
        user_id: msg.user_id,
        user_name: msg.user_name,
        message: msg.message,
      }));

      const { error } = await supabase
        .from('task_messages')
        .insert(messagesToSave);

      if (error) throw error;
      
      // After saving, you might want to refetch messages to get real IDs
      // or update them optimistically. For now, we'll just clear and refetch.
      setMessages([]);
      return true;
    } catch (error) {
      console.error('Error saving draft messages:', error);
      return false;
    }
  };

  return {
    messages,
    sendMessage,
    saveMessages,
  };
};

// Hook for managing authentication state
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
  };
};
