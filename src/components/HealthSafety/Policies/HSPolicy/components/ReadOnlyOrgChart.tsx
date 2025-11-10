import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, User } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { Tree, TreeNode } from 'react-organizational-chart';

export function ReadOnlyOrgChart() {
  const [orgData, setOrgData] = useState<any>({
    id: crypto.randomUUID(),
    name: '',
    title: '',
    children: [],
    reportsTo: [],
    user_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgChart = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('User not authenticated');

        const { data: orgData, error: orgError } = await supabase
          .from('organization_chart')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (orgError) throw orgError;

        const { data: reportingLines, error: reportingError } = await supabase
          .from('reporting_lines')
          .select('*')
          .eq('user_id', user.id);

        if (reportingError) throw reportingError;

        const buildOrgChart = (employees: any[], parentId: string | null = null): any[] => {
          return employees
            .filter(emp => emp.parent_id === parentId)
            .map(emp => ({
              ...emp,
              children: buildOrgChart(employees, emp.id),
              reportsTo: reportingLines
                ?.filter(rl => rl.employee_id === emp.id)
                .map(rl => rl.manager_id) || [],
            }));
        };

        const rootNode = orgData?.find(emp => emp.parent_id === null);
        if (rootNode) {
          const rootEmployees = buildOrgChart(orgData || []);
          setOrgData({
            id: rootNode.id,
            name: '',
            title: '',
            children: rootEmployees.filter(emp => emp.id !== rootNode.id),
            reportsTo: [],
            user_id: user.id
          });
        }
      } catch (err) {
        console.error('Error fetching organization chart:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the organization chart');
      } finally {
        setLoading(false);
      }
    };

    fetchOrgChart();
  }, []);

  const renderNode = (employee: any) => {
    if (employee.id === orgData.id) {
      return (
        <TreeNode
          key={employee.id}
          label={<div style={{ display: 'none' }}></div>}
        >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '4rem', minWidth: '100%' }}>
            {employee.children.map((child: any) => (
              <div key={child.id} style={{ flex: '1', minWidth: 'fit-content', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TreeNode
                  label={
                    <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {child.children.length > 0 ? (
                            <Users className="w-5 h-5 text-blue-400 dark:text-blue-300" />
                          ) : (
                            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{child.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{child.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                >
                  {child.children.map(renderNode)}
                </TreeNode>
              </div>
            ))}
          </div>
        </TreeNode>
      );
    }

    return (
      <TreeNode
        key={employee.id}
        label={
          <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {employee.children.length > 0 ? (
                  <Users className="w-5 h-5 text-blue-400 dark:text-blue-300" />
                ) : (
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{employee.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{employee.title}</p>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {employee.children.map(renderNode)}
      </TreeNode>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-8 rounded-lg overflow-auto">
      <Tree
        lineWidth="2px"
        lineColor="#94a3b8"
        lineBorderRadius="6px"
        label={renderNode(orgData)}
      />
    </div>
  );
}
