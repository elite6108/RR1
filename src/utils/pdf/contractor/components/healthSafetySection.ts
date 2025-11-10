import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Subcontractor, PDFTheme, SatisfactionRating } from '../types';

export const addHealthSafetySection = (
  doc: jsPDF,
  contractor: Subcontractor,
  theme: PDFTheme,
  yPos: number
): number => {
  const { headerColor, cellBackgroundColor, borderColor } = theme;

  // Health & Safety Section
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'HEALTH & SAFETY',
          colSpan: 2,
          styles: { fillColor: headerColor },
        },
      ],
    ],
    body: [
      [
        {
          content: 'Has the contractor submitted a SWMS?',
          styles: { fontStyle: 'bold' },
        },
        contractor.swms ? 'Yes' : 'No',
      ],
      [
        { content: 'Health & Safety Policy?', styles: { fontStyle: 'bold' } },
        contractor.health_safety_policy_url ? 'Yes' : 'No',
      ],
    ],
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 60, halign: 'center' },
    },
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
};

export const addReviewSection = (
  doc: jsPDF,
  contractor: Subcontractor,
  theme: PDFTheme,
  yPos: number
): number => {
  if (!contractor.review) {
    return yPos;
  }

  const { headerColor, cellBackgroundColor, borderColor } = theme;
  let currentY = yPos;

  // Review Requirements and Timeframes
  (doc as any).autoTable({
    startY: currentY,
    head: [
      [
        {
          content: 'REVIEW DETAILS',
          colSpan: 2,
          styles: { fillColor: headerColor },
        },
      ],
    ],
    body: [
      [
        { content: 'Review Date:', styles: { fontStyle: 'bold' } },
        new Date(contractor.review.date).toLocaleDateString(),
      ],
      [
        { content: 'Requirements & Scope:', styles: { fontStyle: 'bold' } },
        contractor.review.requirements_scope || 'N/A',
      ],
      [
        { content: 'Agreed Timeframe:', styles: { fontStyle: 'bold' } },
        contractor.review.agreed_timeframe || 'N/A',
      ],
      [
        { content: 'Total Time Taken:', styles: { fontStyle: 'bold' } },
        contractor.review.total_time_taken || 'N/A',
      ],
    ],
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
    },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Satisfaction Ratings Table
  const satisfactionRatings: SatisfactionRating[] = [
    {
      label: 'Overall Quality of Delivered Project',
      rating: contractor.review.quality_rating,
    },
    {
      label: 'Timeliness of Project Delivery',
      rating: contractor.review.timeliness_rating,
    },
    {
      label: 'Communication',
      rating: contractor.review.communication_rating,
    },
    {
      label: 'Understanding of Requirements',
      rating: contractor.review.understanding_rating,
    },
    {
      label: 'Cooperativeness',
      rating: contractor.review.cooperativeness_rating,
    },
    {
      label: 'Overall Satisfaction',
      rating: contractor.review.overall_satisfaction_rating,
    },
  ];

  (doc as any).autoTable({
    startY: currentY,
    head: [
      [
        {
          content: 'SATISFACTION RATINGS',
          colSpan: 2,
          styles: { fillColor: headerColor },
        },
      ],
    ],
    body: satisfactionRatings.map(({ label, rating }) => [
      { content: label, styles: { fontStyle: 'bold' } },
      rating
        ? rating.rating
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : 'N/A',
    ]),
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
    },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'center' },
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Safety and Compliance Checklist
  const safetyChecklist = [
    [
      'Authority to Work',
      contractor.review.authority_to_work ? 'Yes' : 'No',
    ],
    ['Relevant Permits', contractor.review.relevant_permits ? 'Yes' : 'No'],
    ['Risk Assessments', contractor.review.risk_assessments ? 'Yes' : 'No'],
    [
      'Documents Legible',
      contractor.review.documents_legible ? 'Yes' : 'No',
    ],
    ['Time Limit Clear', contractor.review.time_limit_clear ? 'Yes' : 'No'],
    ['Control Measures', contractor.review.control_measures ? 'Yes' : 'No'],
    ['Work in Line', contractor.review.work_in_line ? 'Yes' : 'No'],
    ['Right People', contractor.review.right_people ? 'Yes' : 'No'],
    [
      'Emergency Knowledge',
      contractor.review.emergency_knowledge ? 'Yes' : 'No',
    ],
    ['PPE Condition', contractor.review.ppe_condition ? 'Yes' : 'No'],
    ['Tools Condition', contractor.review.tools_condition ? 'Yes' : 'No'],
    [
      'Housekeeping Standards',
      contractor.review.housekeeping_standards ? 'Yes' : 'No',
    ],
  ];

  (doc as any).autoTable({
    startY: currentY,
    head: [
      [
        {
          content: 'SAFETY AND COMPLIANCE CHECKLIST',
          colSpan: 2,
          styles: { fillColor: headerColor },
        },
      ],
    ],
    body: safetyChecklist,
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
      valign: 'middle',
    },
    columnStyles: {
      0: {
        cellWidth: 'auto',
        fontStyle: 'bold',
      },
      1: {
        cellWidth: 60,
        halign: 'center',
      },
    },
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
};
