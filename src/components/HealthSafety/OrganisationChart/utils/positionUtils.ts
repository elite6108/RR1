import React from 'react';
import { Position, Employee } from '../types';
import { getAllEmployees } from './employeeUtils';

export const updateNodePositions = (
  chartRef: React.RefObject<HTMLDivElement>,
  setNodePositions: (positions: Map<string, Position>) => void
) => {
  const newPositions = new Map<string, Position>();
  const nodes = document.querySelectorAll('[data-employee-id]');
  
  nodes.forEach((node) => {
    const id = node.getAttribute('data-employee-id');
    if (id) {
      const rect = node.getBoundingClientRect();
      const chartRect = chartRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      newPositions.set(id, {
        x: rect.left - chartRect.left + rect.width / 2,
        y: rect.top - chartRect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    }
  });

  setNodePositions(newPositions);
};

export const drawSecondaryLines = (
  orgData: Employee,
  nodePositions: Map<string, Position>,
  setSecondaryLines: (lines: JSX.Element[]) => void
) => {
  const lines: JSX.Element[] = [];
  const allEmployees = getAllEmployees(orgData);
  
  allEmployees.forEach(employee => {
    if (!employee.reportsTo) return;
    
    // Get all secondary reporting relationships (skip the first/primary one)
    const secondaryManagers = employee.reportsTo.slice(1);
    
    secondaryManagers.forEach(managerId => {
      const employeePos = nodePositions.get(employee.id);
      const managerPos = nodePositions.get(managerId);
      
      if (employeePos && managerPos) {
        // Calculate line positions
        const startX = employeePos.x;
        const startY = employeePos.y - (employeePos.height / 2); // Top of employee
        const endX = managerPos.x;
        const endY = managerPos.y + (managerPos.height / 2); // Bottom of manager
        
        // Calculate the middle point for the horizontal line
        const midY = (startY + endY) / 2;
        
        lines.push(
          React.createElement('svg', {
            key: `${managerId}-${employee.id}`,
            style: {
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }
          }, React.createElement('path', {
            d: `M ${startX} ${startY} 
               L ${startX} ${midY} 
               L ${endX} ${midY} 
               L ${endX} ${endY}`,
            fill: 'none',
            stroke: '#94a3b8',
            strokeWidth: '2'
          }))
        );
      }
    });
  });
  
  setSecondaryLines(lines);
};
