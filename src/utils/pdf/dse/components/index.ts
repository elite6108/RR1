import jsPDF from 'jspdf';
import type { DSEAssessment, PDFDimensions } from '../types';
import { getTableStyles, PDF_THEME } from '../utils';

/**
 * Create employee information table (left box)
 */
export function createEmployeeInfoTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  dimensions: PDFDimensions,
  yPos: number
): void {
  const { detailsHeaderColor, cellBackgroundColor, borderColor } = PDF_THEME;
  const { leftColumnX, rightColumnX, boxWidth } = dimensions;

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'EMPLOYEE INFORMATION',
          styles: { fillColor: detailsHeaderColor },
        },
      ],
    ],
    body: [
      [
        {
          content: [
            { text: assessment.full_name, styles: { fontStyle: 'bold' } },
            {
              text:
                '\nSubmitted: ' +
                new Date(assessment.submitted_date).toLocaleDateString(),
            },
            {
              text:
                '\nNext Due: ' +
                new Date(assessment.next_due_date).toLocaleDateString(),
            },
          ]
            .map((item) => item.text)
            .join(''),
          styles: { cellWidth: 'auto', halign: 'left' },
        },
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: detailsHeaderColor,
      textColor: 'black',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
    },
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth,
  });
}

/**
 * Create assessment details table (right box)
 */
export function createAssessmentDetailsTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  dimensions: PDFDimensions,
  yPos: number
): void {
  const { detailsHeaderColor, cellBackgroundColor, borderColor } = PDF_THEME;
  const { rightColumnX, boxWidth } = dimensions;

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'ASSESSMENT DETAILS',
          styles: { fillColor: detailsHeaderColor },
        },
      ],
    ],
    body: [
      [
        {
          content: [
            {
              text: 'Assessment ID: ' + assessment.id,
              styles: { fontStyle: 'bold' },
            },
            {
              text:
                '\nDate: ' +
                new Date(assessment.submitted_date).toLocaleDateString(),
            },
          ]
            .map((item) => item.text)
            .join(''),
          styles: { cellWidth: 'auto', halign: 'left' },
        },
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: detailsHeaderColor,
      textColor: 'black',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
    },
    margin: { left: rightColumnX, right: 15 },
    tableWidth: boxWidth,
  });
}

/**
 * Create keyboard assessment table
 */
export function createKeyboardAssessmentTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  yPos: number
): number {
  const tableStyles = getTableStyles();

  (doc as any).autoTable({
    startY: yPos,
    head: [['KEYBOARD ASSESSMENT', 'RESULT']],
    body: [
      [
        'Keyboard separate from screen',
        assessment.keyboard_separate_from_screen ? 'Yes' : 'No',
      ],
      ['Keyboard tilt legs', assessment.keyboard_tilt_legs ? 'Yes' : 'No'],
      [
        'Which of the following images best describes your posture?',
        assessment.keyboard_posture,
      ],
      [
        'Keyboard comfortable',
        assessment.keyboard_comfortable ? 'Yes' : 'No',
      ],
      [
        'Keyboard characters clear',
        assessment.keyboard_characters_clear ? 'Yes' : 'No',
      ],
    ],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Create mouse assessment table
 */
export function createMouseAssessmentTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  yPos: number
): number {
  const tableStyles = getTableStyles();

  (doc as any).autoTable({
    startY: yPos,
    head: [['MOUSE ASSESSMENT', 'RESULT']],
    body: [
      [
        'Which of the following images best describes your mouse position?',
        assessment.mouse_position,
      ],
      [
        'Wrist/forearm support',
        assessment.wrist_forearm_support ? 'Yes' : 'No',
      ],
      ['Mouse smooth speed', assessment.mouse_smooth_speed ? 'Yes' : 'No'],
    ],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Create screen assessment table
 */
export function createScreenAssessmentTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  yPos: number
): number {
  const tableStyles = getTableStyles();

  (doc as any).autoTable({
    startY: yPos,
    head: [['SCREEN ASSESSMENT', 'RESULT']],
    body: [
      [
        'Are the characters on the screen clear?',
        assessment.screen_characters_clear ? 'Yes' : 'No',
      ],
      [
        'Is the text size comfortable to read?',
        assessment.screen_text_size_comfortable ? 'Yes' : 'No',
      ],
      [
        'Is the brightness and contrast suitable?',
        assessment.screen_brightness_contrast_suitable ? 'Yes' : 'No',
      ],
      [
        'Can the screen swivel and tilt?',
        assessment.screen_swivel_tilt ? 'Yes' : 'No',
      ],
      [
        'Is the screen free from glare?',
        assessment.screen_free_glare ? 'Yes' : 'No',
      ],
    ],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Create vision assessment table
 */
export function createVisionAssessmentTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  yPos: number
): number {
  const tableStyles = getTableStyles();

  (doc as any).autoTable({
    startY: yPos,
    head: [['VISION ASSESSMENT', 'RESULT']],
    body: [
      [
        'Are you straining your vision to see and use the computer?',
        assessment.vision_straining ? 'Yes' : 'No',
      ],
    ],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Create furniture assessment table
 */
export function createFurnitureAssessmentTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  yPos: number
): number {
  const tableStyles = getTableStyles();

  (doc as any).autoTable({
    startY: yPos,
    head: [['FURNITURE ASSESSMENT', 'RESULT']],
    body: [
      [
        'Is your desk large enough for your tasks?',
        assessment.desk_large_enough ? 'Yes' : 'No',
      ],
      [
        'Can you reach all the files, trays on your desk comfortably?',
        assessment.reach_files_comfortably ? 'Yes' : 'No',
      ],
      [
        'Which describes your posture on the chair?',
        assessment.chair_posture,
      ],
      [
        'Does your chair have castor wheels?',
        assessment.chair_castor_wheels ? 'Yes' : 'No',
      ],
      [
        'Does your chair have height adjustment?',
        assessment.chair_height_adjustment ? 'Yes' : 'No',
      ],
      [
        'Does your chair have depth adjustment?',
        assessment.chair_depth_adjustment ? 'Yes' : 'No',
      ],
      [
        'Does your chair have lumbar support?',
        assessment.chair_lumbar_support ? 'Yes' : 'No',
      ],
      [
        'Does your chair have adjustable backrest?',
        assessment.chair_adjustable_backrest ? 'Yes' : 'No',
      ],
      [
        'Does your chair have adjustable or padded armrests?',
        assessment.chair_adjustable_armrests ? 'Yes' : 'No',
      ],
      [
        'Do you find the chair backrest support your lower back?',
        assessment.chair_backrest_support ? 'Yes' : 'No',
      ],
      [
        'Do you find your forearms are horizontal and eyes at roughly the same height as the top of the screen?',
        assessment.forearms_horizontal ? 'Yes' : 'No',
      ],
      [
        'Are your feet flat on the floor without too much pressure from the seat?',
        assessment.feet_flat_floor ? 'Yes' : 'No',
      ],
    ],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Create environment assessment table
 */
export function createEnvironmentAssessmentTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  yPos: number
): number {
  const tableStyles = getTableStyles();

  (doc as any).autoTable({
    startY: yPos,
    head: [['ENVIRONMENT ASSESSMENT', 'RESULT']],
    body: [
      [
        'Is there enough room to change position and vary movement?',
        assessment.room_change_position ? 'Yes' : 'No',
      ],
      [
        'Is the lighting suitable?',
        assessment.lighting_suitable ? 'Yes' : 'No',
      ],
      [
        'Are the levels of heat comfortable?',
        assessment.heat_comfortable ? 'Yes' : 'No',
      ],
      [
        'Are the levels of noise comfortable?',
        assessment.noise_comfortable ? 'Yes' : 'No',
      ],
    ],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Create feedback table
 */
export function createFeedbackTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  yPos: number
): number {
  const tableStyles = getTableStyles();

  (doc as any).autoTable({
    startY: yPos,
    head: [['FEEDBACK', 'RESULT']],
    body: [
      [
        'Have you experienced any discomfort or other symptoms from using your computer or laptop?',
        assessment.experienced_discomfort ? 'Yes' : 'No',
      ],
      [
        'Would you be interested in having your eye and vision tested?',
        assessment.interested_eye_test ? 'Yes' : 'No',
      ],
      [
        'Do you regularly take breaks working away from screens?',
        assessment.regular_breaks ? 'Yes' : 'No',
      ],
    ],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Create notes table if notes exist
 */
export function createNotesTable(
  doc: jsPDF,
  assessment: DSEAssessment,
  yPos: number
): number {
  if (!assessment.notes) {
    return yPos;
  }

  const tableStyles = getTableStyles();

  (doc as any).autoTable({
    startY: yPos,
    head: [['NOTES']],
    body: [[assessment.notes]],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}
