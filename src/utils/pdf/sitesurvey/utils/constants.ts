import type { PDFStyles } from '../types';

// Field labels for each section
export const fieldLabels = {
  // Site Survey Details
  customer: 'Customer:',
  project: 'Project:',
  fullAddress: 'Full Address:',
  what3words: 'What3Words:',
  siteContact: 'Site Contact:',

  // Site Access
  siteAccessDescription: 'Describe Site Access:',
  suitableForLorry: 'Is the site access suitable for a 3.5m lorry?',
  siteAccessImages: 'Site Access Images:',

  // Land
  waterHandling: 'How does the ground deal with water?',
  manholesDescription: 'Is there any man holes or inspection service chambers in the padel court area?',
  servicesPresent: 'Is there any electrical, gas, utility services cables or pipes?',
  servicesDescription: 'Services description:',

  // Work Required
  numberOfCourts: 'How many courts?',
  shutteringRequired: 'Shuttering required?',
  tarmacRequired: 'Tarmac Required?',
  tarmacLocation: 'Where is tarmac required:',
  tarmacWagonSpace: 'Is there space to hold the tarmac waggon to tip, or keep feeding it out?',
  muckawayRequired: 'Muckaway required or lose muck on site?',
  surfaceType: 'Type of surface required:',
  lightingRequired: 'Lighting required?',
  lightingDescription: 'Lighting requirements:',
  canopiesRequired: 'Canopies required?',
  numberOfCanopies: 'Number of canopies:',

  // Court Features
  courtDimensions: 'Padel court dimensions:',
  courtHeight: 'Padel court height:',
  courtEnclosureType: 'Padel court enclosures:',
  courtFloorMaterial: 'Padel court floor materials:',
  courtFeatures: 'Court Features:',
  
  // Notes
  notesComments: 'Notes/Comments:'
};

// PDF styling constants
export const pdfStyles: PDFStyles = {
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  borderColor: [211, 211, 211] // Light gray border
};

// Layout constants
export const layoutConstants = {
  leftColumnX: 15, // Left margin
  rightColumnXOffset: 5, // Offset for right column
  boxWidthOffset: 20, // Box width offset for equal spacing
  logoMaxWidth: 40,
  logoMaxHeight: 20,
  logoDefaultAspectRatio: 300/91,
  logoPosition: {
    x: 15,
    y: 15
  },
  titlePosition: {
    x: 195,
    y: 25
  },
  initialYPosition: 45,
  companyInfoYPosition: 125
};

// Image processing constants
export const imageConstants = {
  maxWidth: 180, // Max width in mm
  maxHeight: 120, // Max height in mm
  captionFontSize: 8,
  captionOffset: 5,
  imageSpacing: 15,
  pageMargin: 30,
  bottomMargin: 20,
  newPageYPosition: 20
};

// Font settings
export const fontSettings = {
  defaultFont: 'helvetica',
  titleSize: 20,
  defaultSize: 10,
  captionSize: 8,
  footerSize: 9,
  titleWeight: 'bold' as const,
  normalWeight: 'normal' as const
};

// Column styles for tables
export const columnStyles = {
  standard: {
    0: { cellWidth: 'auto' as const },
    1: { cellWidth: 20 },
    2: { cellWidth: 'auto' as const },
    3: { cellWidth: 20 },
    4: { cellWidth: 'auto' as const },
    5: { cellWidth: 20 }
  },
  siteSurveyDetails: {
    0: { cellWidth: 'auto' as const },
    1: { cellWidth: 'auto' as const }
  }
};

// Enclosure type descriptions
export const enclosureDescriptions = {
  'Option 1': 'Option 1 is the most common type of padel court in the UK and uses stepped walls at each end of the court. ' +
    'The first 2m wide step at each end of the court is 3m high from the floor and the second 2m wide step is 2m high. ' +
    'These steps are typically made from glass panels but can be fiberglass, concrete, rendered bricks/blocks or other materials. ' +
    'Each step then has 1m of metallic mesh fence added to take the total height of the first step to 4m and the height of the second step to 3m. ' +
    'Where the two different parts of the wall meet it should be flush to avoid any irregular bounces. ' +
    'The remaining 12m length of the court (6m either side of the net) is made up of 3m high metallic mesh fence, with doors often located by the net on one or both sides of the court.',
    
  'Option 2': 'Option 2 has the same stepped walls, but the metallic mesh fence is 2m high on the second step meaning both steps are 4m high. ' +
    'The 12m length of court in the middle uses 4m high metallic mesh fence, meaning the court enclosure is 4m high all the way round the court. ' +
    'As with option 1 the materials are the same and the two parts of the wall must be flush with neither material protruding to cause irregular bounces.'
};
