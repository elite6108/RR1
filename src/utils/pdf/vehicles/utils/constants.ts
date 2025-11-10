import type { PDFTheme, LogoDimensions, TableStyles } from '../types';

// PDF Theme Configuration
export const PDF_THEME: PDFTheme = {
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  detailsHeaderColor: '#edeaea',
  borderColor: [211, 211, 211] // Light gray border
};

// Logo Configuration
export const LOGO_CONFIG: LogoDimensions = {
  maxWidth: 40,
  maxHeight: 20,
  aspectRatio: 300/91, // Default aspect ratio
  width: 0, // Will be calculated
  height: 0  // Will be calculated
};

// Table Styles Configuration
export const TABLE_STYLES: TableStyles = {
  fontSize: 10,
  cellPadding: 3,
  lineWidth: 0.1,
  lineColor: [211, 211, 211]
};

// Layout Configuration
export const LAYOUT_CONFIG = {
  leftMargin: 15,
  rightMargin: 15,
  pageMargins: {
    left: 15,
    right: 15
  },
  columnSpacing: 5,
  sectionSpacing: 10,
  footerMargin: 10
};

// Font Configuration
export const FONT_CONFIG = {
  defaultFont: 'helvetica',
  titleSize: 20,
  defaultSize: 10,
  footerSize: 9
};

// Vehicle Check Categories
export const CHECK_CATEGORIES = {
  OUTSIDE_CHECKS: [
    'Engine Oil',
    'Coolant Level', 
    'Washer Fluid Level',
    'Washer & Wipers',
    'Lights (Front, Side, Rear)',
    'Horn',
    'Tyre Tread & Sidewalls',
    'Type Pressure',
    'Bodywork',
    'Glass (Windows)',
    'Mirrors'
  ],
  INSIDE_CHECKS: [
    'Seatbelt',
    'First Aid & Eye Wash',
    'Brakes',
    'Indicator',
    'Clean & Tidy'
  ]
};

// Status Colors
export const STATUS_COLORS = {
  FAIL: '#FF0000',
  PASS: '#18ca3d'
};
