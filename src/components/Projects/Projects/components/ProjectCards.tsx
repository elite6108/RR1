import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardsProps {
  projects: Project[];
  loading: boolean;
  onProjectClick: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectCards({
  projects,
  loading,
  onProjectClick,
  onEditProject,
  onDeleteProject,
}: ProjectCardsProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="lg:hidden">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="lg:hidden">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No projects found. Add a project to access project files, to do lists, rams, site survey, contracts, gantt timeline, additional work and the sign off sheet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden">
        <div className="space-y-4 p-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => onProjectClick(project)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProject(project);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                    className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                {project.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="text-gray-900 dark:text-white text-right">{project.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
