// Theme colors and styles for the sign-off PDF
export const PDF_THEME = {
  colors: {
    theme: '#000000',
    header: '#edeaea',
    cellBackground: '#f7f7f7',
    detailsHeader: '#edeaea',
    border: [211, 211, 211] as [number, number, number], // Light gray border
    text: 0,
    footerText: 100
  },
  fonts: {
    default: 'helvetica',
    size: {
      title: 20,
      normal: 10,
      footer: 9
    }
  },
  layout: {
    margins: {
      left: 15,
      right: 15,
      footer: 10
    },
    logo: {
      maxWidth: 40,
      maxHeight: 20,
      defaultAspectRatio: 300/91,
      position: {
        x: 15,
        y: 15
      }
    },
    title: {
      position: {
        x: 195,
        y: 25
      }
    },
    startY: 45
  }
};

// Project information text content
export const PROJECT_INFO_TEXT = `I hereby confirm that the construction work described in this document has been completed to the agreed specifications, standards, and satisfaction in accordance to the quote or pro-forma sent out. All necessary inspections have been carried out.

By signing below, I acknowledge that I have reviewed the completed works and approve for handover.`;

// Table headers
export const TABLE_HEADERS = {
  companyInfo: 'COMPANY INFORMATION',
  projectDetails: 'PROJECT DETAILS',
  projectInfo: 'PROJECT INFORMATION',
  signatures: 'SIGNATURES'
};
