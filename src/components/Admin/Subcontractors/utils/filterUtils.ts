import { Subcontractor } from '../types';

export const filterContractors = (contractors: Subcontractor[], searchTerm: string): Subcontractor[] => {
  return contractors.filter(
    (contractor) =>
      contractor.company_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contractor.services_provided
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
};
