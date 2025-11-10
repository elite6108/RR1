export const PDFStyles = {
  // Font settings
  font: {
    family: 'helvetica',
    sizes: {
      title: 12,
      header: 10,
      body: 10,
      footer: 9,
    },
    weights: {
      normal: 'normal',
      bold: 'bold',
    },
  },

  // Spacing settings
  spacing: {
    pageMargin: 15,
    lineHeight: {
      title: 6,
      header: 5,
      body: 5,
      footer: 4,
    },
    paragraphSpacing: {
      small: 3,
      medium: 6,
      large: 10,
    },
    sectionSpacing: {
      before: 4,
      after: 6,
    },
  },

  // Colors
  colors: {
    text: {
      primary: '#000000',
      secondary: '#666666',
      light: '#999999',
    },
    background: {
      section: [243, 244, 246], // Light gray for section headers
    },
  },

  // Layout settings
  layout: {
    contentWidth: (pageWidth: number, margin: number) => pageWidth - 2 * margin,
    signatureLineWidth: (contentWidth: number) => contentWidth * 0.6,
    dateLineWidth: (contentWidth: number) => contentWidth * 0.2,
  },
};
