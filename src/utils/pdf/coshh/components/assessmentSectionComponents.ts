import { CoshhAssessment, PDFStyles } from '../types';
import { buildTableRow, formatDate } from '../utils/dataHelpers';

// Create exposure information table
export const createExposureInformationTable = (
  doc: any,
  assessment: CoshhAssessment,
  styles: PDFStyles,
  yPos: number
): void => {
  const exposureData = [];
  if (assessment.hazards_precautions) {
    exposureData.push(buildTableRow('Hazards & Precautions', assessment.hazards_precautions));
  }
  if (assessment.occupational_exposure) {
    exposureData.push(buildTableRow('Occupational Exposure (OES)', assessment.occupational_exposure));
  }
  if (assessment.maximum_exposure) {
    exposureData.push(buildTableRow('Maximum Exposure Limits (MEL)', assessment.maximum_exposure));
  }
  if (assessment.workplace_exposure) {
    exposureData.push(buildTableRow('Workplace Exposure Limits (WEL)', assessment.workplace_exposure));
  }
  if (assessment.stel) {
    exposureData.push(buildTableRow('Short-Term Exposure Limit (STEL) 15 mins', assessment.stel));
  }
  if (assessment.stability_reactivity) {
    exposureData.push(buildTableRow('Stability and Reactivity', assessment.stability_reactivity));
  }
  if (assessment.ecological_information) {
    exposureData.push(buildTableRow('Ecological Information', assessment.ecological_information));
  }

  if (exposureData.length > 0) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['EXPOSURE INFORMATION', '']],
      body: exposureData,
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        halign: 'left'
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};

// Create usage frequency table
export const createUsageFrequencyTable = (
  doc: any,
  assessment: CoshhAssessment,
  styles: PDFStyles,
  yPos: number
): void => {
  const usageData = [];
  if (assessment.amount_used) {
    usageData.push(buildTableRow('Amount Used', assessment.amount_used));
  }
  if (assessment.times_per_day) {
    usageData.push(buildTableRow('Times per Day', assessment.times_per_day));
  }
  if (assessment.duration) {
    usageData.push(buildTableRow('Duration', assessment.duration));
  }
  if (assessment.how_often_process) {
    usageData.push(buildTableRow('How Often Process Done', assessment.how_often_process));
  }
  if (assessment.how_long_process) {
    usageData.push(buildTableRow('How Long Process Takes', assessment.how_long_process));
  }

  if (usageData.length > 0) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['USAGE FREQUENCY', '']],
      body: usageData,
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        halign: 'left'
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};

// Create control measures table
export const createControlMeasuresTable = (
  doc: any,
  assessment: CoshhAssessment,
  additionalControlItems: string[],
  styles: PDFStyles,
  yPos: number
): void => {
  const controlData = [];
  if (assessment.general_precautions) {
    controlData.push(buildTableRow('General Precautions', assessment.general_precautions));
  }
  if (assessment.first_aid_measures) {
    controlData.push(buildTableRow('First Aid Measures', assessment.first_aid_measures));
  }
  if (assessment.accidental_release_measures) {
    controlData.push(buildTableRow('Accidental Release Measures', assessment.accidental_release_measures));
  }
  if (assessment.ventilation) {
    controlData.push(buildTableRow('Ventilation', assessment.ventilation));
  }
  if (assessment.handling) {
    controlData.push(buildTableRow('Handling', assessment.handling));
  }
  if (assessment.storage) {
    controlData.push(buildTableRow('Storage', assessment.storage));
  }
  if (additionalControlItems.length > 0) {
    controlData.push(buildTableRow('Additional Control Items', additionalControlItems.join('\n• ')));
  }
  if (assessment.further_controls) {
    controlData.push(buildTableRow('Further Controls Required', assessment.further_controls));
  }
  if (assessment.respiratory_protection) {
    controlData.push(buildTableRow('Respiratory Protection', assessment.respiratory_protection));
  }
  if (assessment.ppe_details) {
    controlData.push(buildTableRow('PPE Details', assessment.ppe_details));
  }
  if (assessment.monitoring) {
    controlData.push(buildTableRow('Monitoring', assessment.monitoring));
  }
  if (assessment.health_surveillance) {
    controlData.push(buildTableRow('Health Surveillance', assessment.health_surveillance));
  }
  if (assessment.responsibility) {
    controlData.push(buildTableRow('Responsibility', assessment.responsibility));
  }
  if (assessment.by_when) {
    controlData.push(buildTableRow('By When', formatDate(assessment.by_when)));
  }

  if (controlData.length > 0) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['CONTROL MEASURES', '']],
      body: controlData,
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        halign: 'left'
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};

// Create emergency procedures table
export const createEmergencyProceduresTable = (
  doc: any,
  assessment: CoshhAssessment,
  styles: PDFStyles,
  yPos: number
): void => {
  const emergencyData = [];
  if (assessment.spillage_procedure) {
    emergencyData.push(buildTableRow('Spillage Procedure', assessment.spillage_procedure));
  }
  if (assessment.fire_explosion) {
    emergencyData.push(buildTableRow('Fire & Explosion Prevention', assessment.fire_explosion));
  }
  if (assessment.handling_storage) {
    emergencyData.push(buildTableRow('Handling & Storage', assessment.handling_storage));
  }
  if (assessment.disposal_considerations) {
    emergencyData.push(buildTableRow('Disposal Considerations', assessment.disposal_considerations));
  }

  if (emergencyData.length > 0) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['EMERGENCY PROCEDURES & STORAGE', '']],
      body: emergencyData,
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        halign: 'left'
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};

// Create assessment comments table
export const createAssessmentCommentsTable = (
  doc: any,
  comments: string,
  styles: PDFStyles,
  yPos: number
): void => {
  if (comments) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['ASSESSMENT COMMENTS']],
      body: [[comments]],
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineWidth: 0.1,
        lineColor: styles.borderColor
      },
      theme: 'grid',
      margin: { left: 15, right: 15 }
    });
  }
};

// Create assessor summary table
export const createAssessorSummaryTable = (
  doc: any,
  assessment: CoshhAssessment,
  styles: PDFStyles,
  yPos: number
): void => {
  const questionData = [
    ['Has the assessment taken into account all relevant factors?', assessment.q1_answer ? 'Yes' : 'No', assessment.q1_action || 'N/A'],
    ['Has the feasibility of preventing exposure been considered?', assessment.q2_answer ? 'Yes' : 'No', assessment.q2_action || 'N/A'],
    ['Has the assessment addressed sufficient control measures?', assessment.q3_answer ? 'Yes' : 'No', assessment.q3_action || 'N/A'],
    ['Has the need for monitoring exposure been evaluated?', assessment.q4_answer ? 'Yes' : 'No', assessment.q4_action || 'N/A'],
    ['Has the assessment identified compliance requirements?', assessment.q5_answer ? 'Yes' : 'No', assessment.q5_action || 'N/A'],
  ];

  (doc as any).autoTable({
    startY: yPos,
    head: [['ASSESSOR SUMMARY', 'ANSWER', 'ACTION REQUIRED']],
    body: questionData,
    headStyles: {
      fillColor: styles.headerColor,
      textColor: styles.themeColor,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fillColor: styles.cellBackgroundColor
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 60 }
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: styles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });
};

// Create assessment conclusion table
export const createAssessmentConclusionTable = (
  doc: any,
  conclusion: string,
  styles: PDFStyles,
  yPos: number
): void => {
  if (conclusion) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['ASSESSMENT CONCLUSION']],
      body: [[conclusion]],
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineWidth: 0.1,
        lineColor: styles.borderColor
      },
      theme: 'grid',
      margin: { left: 15, right: 15 }
    });
  }
};

// Create PPE location table
export const createPPELocationTable = (
  doc: any,
  ppeLocation: string,
  styles: PDFStyles,
  yPos: number
): void => {
  if (ppeLocation) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['PPE LOCATION', '']],
      body: [buildTableRow('Location', ppeLocation)],
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};
