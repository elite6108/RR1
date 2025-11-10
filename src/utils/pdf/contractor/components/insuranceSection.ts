import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Subcontractor, PDFTheme, InsuranceType } from '../types';

export const addInsuranceSection = (
  doc: jsPDF,
  contractor: Subcontractor,
  theme: PDFTheme,
  yPos: number
): number => {
  const { headerColor, borderColor } = theme;

  // Insurance Details - Cross-tabulation table
  const insuranceTypes: InsuranceType[] = [
    {
      key: 'employers_liability',
      title: 'Employers Liability',
      data: contractor.employers_liability,
    },
    {
      key: 'public_liability',
      title: 'Public Liability',
      data: contractor.public_liability,
    },
    {
      key: 'professional_negligence',
      title: 'Professional Negligence',
      data: contractor.professional_negligence,
    },
    {
      key: 'contractors_all_risk',
      title: 'Contractors All Risk',
      data: contractor.contractors_all_risk,
    },
  ];

  // Add custom insurance types if they exist
  if (contractor.custom_insurance_types) {
    Object.entries(contractor.custom_insurance_types).forEach(
      ([key, value]) => {
        insuranceTypes.push({
          key: key,
          title: key
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          data: value,
        });
      }
    );
  }

  // Create the cross-tabulation table for insurance
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'INSURANCE DETAILS',
          colSpan: 5,
          styles: { fillColor: headerColor },
        },
      ],
      [
        { content: '', styles: { fillColor: headerColor } },
        { content: 'Insurer', styles: { fillColor: headerColor } },
        { content: 'Policy Number', styles: { fillColor: headerColor } },
        { content: 'Renewal Date', styles: { fillColor: headerColor } },
        { content: 'Limit of Indemnity', styles: { fillColor: headerColor } },
      ],
    ],
    body: insuranceTypes.map((insurance) => [
      {
        content: insurance.title,
        styles: { fillColor: headerColor, fontStyle: 'bold' },
      },
      insurance.data?.insurer || 'N/A',
      insurance.data?.policy_no || 'N/A',
      insurance.data?.renewal_date
        ? new Date(insurance.data.renewal_date).toLocaleDateString()
        : 'N/A',
      insurance.data?.limit_of_indemnity || 'N/A',
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: borderColor,
      halign: 'left',
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: headerColor, cellWidth: 60 },
    },
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
};
