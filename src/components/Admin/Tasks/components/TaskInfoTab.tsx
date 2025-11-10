import React from 'react';
import { X } from 'lucide-react';
import { Task, Board, Project, CombinedStaffUser, TaskFormData } from '../types';
import { Calendar } from '../../../../utils/calendar/Calendar';

interface TaskInfoTabProps {
  taskFormData: TaskFormData;
  setTaskFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  boards: Board[];
  projects: Project[];
  combinedStaffUsers: CombinedStaffUser[];
}

export const TaskInfoTab: React.FC<TaskInfoTabProps> = ({
  taskFormData,
  setTaskFormData,
  boards,
  projects,
  combinedStaffUsers,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 singlerow">
      <div className="fullw">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Board *
        </label>
        <select
          value={taskFormData.board_id || ''}
          onChange={(e) =>
            setTaskFormData({
              ...taskFormData,
              board_id: Number(e.target.value),
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600"
          required
        >
          <option value="">Select a board</option>
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
      </div>

      <div className="fullw">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          value={taskFormData.status}
          onChange={(e) => {
            const newStatus = e.target.value as Task['status'];
            setTaskFormData({
              ...taskFormData,
              status: newStatus,
              due_date:
                newStatus === 'over_due'
                  ? ''
                  : taskFormData.due_date,
            });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600"
          required
        >
          <option value="to_schedule">To Schedule</option>
          <option value="booked_in">Booked In</option>
          <option value="in_progress">In Progress</option>
          <option value="purchased">Purchased</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="fullw">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={taskFormData.title}
          onChange={(e) =>
            setTaskFormData({ ...taskFormData, title: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="fullw">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority *
        </label>
        <select
          value={taskFormData.priority}
          onChange={(e) =>
            setTaskFormData({
              ...taskFormData,
              priority: e.target.value as Task['priority'],
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600"
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="fullw">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={taskFormData.category || ''}
          onChange={(e) =>
            setTaskFormData({
              ...taskFormData,
              category: e.target.value as Task['category'],
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600"
          required
        >
          <option value="">Select a category</option>
          <option value="Quote">Quote</option>
          <option value="Repair">Repair</option>
          <option value="Aftersales">Aftersales</option>
          <option value="Complaints">Complaints</option>
          <option value="Remedials">Remedials</option>
          <option value="Finance">Finance</option>
          <option value="Insurance">Insurance</option>
          <option value="Tax">Tax</option>
          <option value="Banking">Banking</option>
        </select>
      </div>

      <div className="fullw">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project
        </label>
        <select
          value={taskFormData.project_id || ''}
          onChange={(e) =>
            setTaskFormData({
              ...taskFormData,
              project_id: e.target.value || null,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="fullw">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>
        <Calendar
          selectedDate={taskFormData.due_date}
          onDateSelect={(date) =>
            setTaskFormData({ ...taskFormData, due_date: date })
          }
          placeholder="Select due date"
          className="w-full"
        />
      </div>

      <div className="fullw">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cost (£)
        </label>
        <input
          type="number"
          step="0.01"
          value={taskFormData.cost || ''}
          onChange={(e) =>
            setTaskFormData({
              ...taskFormData,
              cost: e.target.value ? parseFloat(e.target.value) : null,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={taskFormData.description}
          onChange={(e) =>
            setTaskFormData({ ...taskFormData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assigned Staff <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 dark:bg-[#29303b] dark:border-gray-600">
          {combinedStaffUsers.map((member) => {
            // For staff members, use their numeric ID directly
            // For users, we'll use negative IDs to distinguish them from staff
            let isChecked = false;
            if (member.type === 'staff') {
              const staffId = member.original_id as number;
              isChecked = taskFormData.staff_ids.includes(staffId);
            } else {
              // For users, use the helper function to get consistent ID
              const userId = member.original_id as string;
              const negativeId = -Math.abs(String(userId).split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
              }, 0));
              isChecked = taskFormData.staff_ids.includes(negativeId);
            }
            
            return (
              <label
                key={member.id}
                className="relative flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer group"
              >
                <div className="flex items-center h-5">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        let newStaffIds: number[];
                        
                        if (member.type === 'staff') {
                          // Handle staff members normally
                          const staffId = member.original_id as number;
                          newStaffIds = e.target.checked
                            ? [...taskFormData.staff_ids, staffId]
                            : taskFormData.staff_ids.filter((id) => id !== staffId);
                        } else {
                          // For users, use the helper function to get consistent ID
                          const userId = member.original_id as string;
                          const negativeId = -Math.abs(String(userId).split('').reduce((a, b) => {
                            a = ((a << 5) - a) + b.charCodeAt(0);
                            return a & a;
                          }, 0));
                          
                          newStaffIds = e.target.checked
                            ? [...taskFormData.staff_ids, negativeId]
                            : taskFormData.staff_ids.filter((id) => id !== negativeId);
                        }
                        
                        setTaskFormData({
                          ...taskFormData,
                          staff_ids: newStaffIds,
                        });
                      }}
                      className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md transition-all duration-200 ease-in-out cursor-pointer checked:border-indigo-600 checked:bg-indigo-600 hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                    />
                    <svg
                      className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-white peer-checked:opacity-100 opacity-0 transition-opacity duration-200"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3334 4L6.00008 11.3333L2.66675 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex items-center">
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                      {member.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {member.position || (member.type === 'user' ? 'User' : '')}
                    </span>
                    <span className={`ml-2 inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                      member.type === 'staff' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {member.type}
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <p className="text-sm text-gray-600 mb-2">Type your tag and press enter to add.</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {taskFormData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => {
                  const newTags = [...taskFormData.tags];
                  newTags.splice(index, 1);
                  setTaskFormData({
                    ...taskFormData,
                    tags: newTags,
                  });
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a tag"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.target as HTMLInputElement;
                const value = input.value.trim();
                if (value && !taskFormData.tags.includes(value)) {
                  setTaskFormData({
                    ...taskFormData,
                    tags: [...taskFormData.tags, value],
                  });
                  input.value = '';
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
