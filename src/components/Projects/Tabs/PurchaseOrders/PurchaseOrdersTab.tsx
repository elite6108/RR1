import React from 'react';
import { PurchaseOrdersList } from '../../../PurchaseOrders/PurchaseOrders/PurchaseOrdersList';
import type { Project, PurchaseOrder } from '../../../../types/database';

interface PurchaseOrdersTabProps {
  project: Project;
  orders: PurchaseOrder[];
  onOrderChange: () => void;
  isLoading: boolean;
}

export function PurchaseOrdersTab({ project, orders, onOrderChange, isLoading }: PurchaseOrdersTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <PurchaseOrdersList
      orders={orders}
      onOrderChange={onOrderChange}
      onBack={() => {}} // This is handled by the parent component
      hideBreadcrumbs={true}
      preselectedProject={project}
      disableProjectSelection={true}
    />
  );
} 