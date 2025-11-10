import type { ModulesConfig } from '../types';

export const moduleDefinitions: Array<{
  key: keyof ModulesConfig;
  title: string;
  description: string;
}> = [
  {
    key: 'admin',
    title: 'Admin',
    description: 'Staff, Tasks, Calendar, and Sub Contractors'
  },
  {
    key: 'customersAndProjects',
    title: 'Customers & Projects',
    description: 'Customer and project management'
  },
  {
    key: 'purchaseOrders',
    title: 'Purchase Orders',
    description: 'Order and supplier management'
  },
  {
    key: 'quotes',
    title: 'Quotes',
    description: 'Quote management and terms'
  },
  {
    key: 'healthAndSafety',
    title: 'Health & Safety',
    description: 'Policies, RAMS, and safety features'
  },
  {
    key: 'training',
    title: 'Training',
    description: 'DSE Assessments and Training Matrix'
  },
  {
    key: 'reporting',
    title: 'Reporting',
    description: 'Accidents and Action Plans'
  }
];

export const generateToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let token = '';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 4) token += '-';
  }
  return token;
};