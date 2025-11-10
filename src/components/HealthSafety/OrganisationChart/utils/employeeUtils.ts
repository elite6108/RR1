import { Employee } from '../types';

export const findEmployee = (id: string, employee: Employee): Employee | null => {
  if (employee.id === id) return employee;
  for (const child of employee.children) {
    const found = findEmployee(id, child);
    if (found) return found;
  }
  return null;
};

export const getAllEmployees = (employee: Employee): Employee[] => {
  const employees = [employee];
  for (const child of employee.children) {
    employees.push(...getAllEmployees(child));
  }
  return employees;
};

export const buildOrgChart = (employees: any[], reportingLines: any[], parentId: string | null = null): Employee[] => {
  return employees
    .filter(emp => emp.parent_id === parentId)
    .map(emp => ({
      ...emp,
      children: buildOrgChart(employees, reportingLines, emp.id),
      reportsTo: reportingLines
        ?.filter((rl: any) => rl.employee_id === emp.id)
        .map((rl: any) => rl.manager_id) || [],
    }));
};

export const findAllReportsTo = (employeeId: string, orgData: Employee, visited = new Set<string>()): Set<string> => {
  if (visited.has(employeeId)) return visited;
  visited.add(employeeId);
  
  const employee = findEmployee(employeeId, orgData);
  if (!employee) return visited;
  
  employee.reportsTo.forEach(managerId => {
    findAllReportsTo(managerId, orgData, visited);
  });
  
  return visited;
};
