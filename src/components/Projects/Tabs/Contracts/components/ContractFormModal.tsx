import React from 'react';
import { createPortal } from 'react-dom';
import { ContractsForm } from '../../../../Contracts';
import type { ContractFormModalProps } from '../types';

export function ContractFormModal({
  isOpen,
  contract,
  project,
  onClose,
  onSuccess
}: ContractFormModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <ContractsForm
      onClose={onClose}
      onSuccess={onSuccess}
      contract={contract}
      preSelectedProjectId={project.id}
      disableCustomerAndProject={contract !== null}
    />,
    document.body
  );
}
