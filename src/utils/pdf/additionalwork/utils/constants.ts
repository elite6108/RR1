import type { PDFTheme } from '../types';

export const PDF_THEME: PDFTheme = {
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  detailsHeaderColor: '#edeaea',
  borderColor: [211, 211, 211] // Light gray border
};

export const LOGO_CONFIG = {
  maxWidth: 40,
  maxHeight: 20,
  defaultAspectRatio: 300/91,
  position: {
    x: 15,
    y: 15
  }
};

export const PAGE_LAYOUT = {
  leftMargin: 15,
  rightMargin: 15,
  titlePosition: {
    x: 195,
    y: 25
  },
  initialYPosition: 45
};

export const FONT_SIZES = {
  title: 20,
  normal: 10,
  footer: 9
};

export const TABLE_STYLES = {
  fontSize: 10,
  cellPadding: 3,
  lineWidth: 0.1,
  signatureCellPadding: 10,
  signatureMinHeight: 120
};
