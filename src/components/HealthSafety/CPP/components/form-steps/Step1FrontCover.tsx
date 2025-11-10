import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { CPPFormData } from '../../../../../types/cpp';
import type { Project } from '../../../../../types/database';

interface Step1FrontCoverProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step1FrontCover({ data, onChange }: Step1FrontCoverProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('name', { ascending: true });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching projects'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      frontCover: {
        ...data.frontCover,
        [name]: value,
      },
    });
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject = projects.find((p) => p.id === e.target.value);
    onChange({
      frontCover: {
        ...data.frontCover,
        projectId: e.target.value,
        projectName: selectedProject?.name || '',
      },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Front Cover</h3>

      <div>
        <label
          htmlFor="projectId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Project
        </label>
        <select
          id="projectId"
          name="projectId"
          value={data.frontCover.projectId}
          onChange={handleProjectChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="projectReference"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Project Reference
        </label>
        <input
          type="text"
          id="projectReference"
          name="projectReference"
          value={data.frontCover.projectReference}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="fileName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          File Name
        </label>
        <input
          type="text"
          id="fileName"
          name="fileName"
          value={data.frontCover.fileName || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="version"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Version
        </label>
        <input
          type="text"
          id="version"
          name="version"
          value={data.frontCover.version || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="approvedBy"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Approved By
        </label>
        <input
          type="text"
          id="approvedBy"
          name="approvedBy"
          value="R. Stewart"
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
        />
      </div>
    </div>
  );
}
