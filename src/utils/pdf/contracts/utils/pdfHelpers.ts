/*
 * PDF utility functions for contract PDF generation
 */

import jsPDF from 'jspdf';
import { PDFStyles } from '../../../../styles/pdffont';

const pageMargin = PDFStyles.spacing.pageMargin;

/**
 * Add a section header to the PDF
 */
export function addSectionHeader(doc: jsPDF, title: string, y: number): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = PDFStyles.layout.contentWidth(pageWidth, pageMargin);

  // Calculate header height plus space for a few lines of content
  const headerHeight = 8; // Fixed height for header box
  const minContentHeight = 20; // Minimum height for at least a few lines of content
  const totalSpaceNeeded = headerHeight + minContentHeight;

  // Check if we need a new page
  if (y + totalSpaceNeeded > pageHeight - pageMargin) {
    doc.addPage();
    y = pageMargin; // Reset y position to top of new page
  }

  doc.setFillColor(...PDFStyles.colors.background.section);
  // Create a rectangle for section header with appropriate height
  doc.rect(pageMargin, y, contentWidth, headerHeight, 'F');

  doc.setFont(PDFStyles.font.family, PDFStyles.font.weights.bold);
  doc.setFontSize(PDFStyles.font.sizes.header);
  doc.setTextColor(0);

  // Center text vertically in the header box
  doc.text(title, pageMargin + 5, y + headerHeight / 2 + 1);

  // Return position after header plus spacing
  return y + headerHeight + PDFStyles.spacing.sectionSpacing.after;
}

/**
 * Add section content to the PDF
 */
export function addSectionContent(doc: jsPDF, content: string, y: number): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = PDFStyles.layout.contentWidth(pageWidth, pageMargin);

  doc.setFont(PDFStyles.font.family, PDFStyles.font.weights.normal);
  doc.setFontSize(PDFStyles.font.sizes.body);

  // Handle multiline text with wrapping
  const lines = doc.splitTextToSize(content, contentWidth - 10);

  // Calculate total height needed for the content
  const totalContentHeight = lines.length * PDFStyles.spacing.lineHeight.body;

  // If content is too large for current page, move to next page
  if (y + totalContentHeight > pageHeight - pageMargin) {
    // But first print at least a few lines on this page if possible
    const minLinesOnCurrentPage = 3;
    const spaceAvailable = pageHeight - pageMargin - y;
    const linesAvailable = Math.floor(
      spaceAvailable / PDFStyles.spacing.lineHeight.body
    );

    if (linesAvailable >= minLinesOnCurrentPage) {
      // Print some content on current page
      const firstPageLines = lines.slice(0, linesAvailable);
      doc.text(firstPageLines, pageMargin + 5, y);

      // Add new page for remaining content
      doc.addPage();

      // Print remaining content on new page
      const remainingLines = lines.slice(linesAvailable);
      if (remainingLines.length > 0) {
        doc.text(remainingLines, pageMargin + 5, pageMargin);
        return (
          pageMargin +
          remainingLines.length * PDFStyles.spacing.lineHeight.body +
          PDFStyles.spacing.paragraphSpacing.medium
        );
      }
      return pageMargin + PDFStyles.spacing.paragraphSpacing.medium;
    } else {
      // If can't fit minimum lines, move all content to next page
      doc.addPage();
      y = pageMargin; // Reset y position to top of new page
      doc.text(lines, pageMargin + 5, y);
      return (
        y + totalContentHeight + PDFStyles.spacing.paragraphSpacing.medium
      );
    }
  } else {
    // All content fits on current page
    doc.text(lines, pageMargin + 5, y);
    return (
      y + totalContentHeight + PDFStyles.spacing.paragraphSpacing.medium
    );
  }
}

/**
 * Check if we need a new page
 */
export function checkNewPage(doc: jsPDF, neededSpace: number, currentY: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // If there's not enough space for at least the section header plus a few lines of content
  // (e.g. less than 60 points remaining), then start a new page
  const minimumSpaceRequired = 60;

  if (
    currentY + Math.max(neededSpace, minimumSpaceRequired) >
    pageHeight - pageMargin
  ) {
    doc.addPage();
    return pageMargin;
  }
  return currentY;
}

/**
 * Add wrapped text with proper indentation
 */
export function addWrappedText(
  doc: jsPDF,
  text: string,
  indentation: number,
  startY: number
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = PDFStyles.layout.contentWidth(pageWidth, pageMargin);
  
  const maxWidth = contentWidth - indentation - 10;
  const lines = doc.splitTextToSize(text, maxWidth);

  // Calculate total height needed
  const totalTextHeight = lines.length * PDFStyles.spacing.lineHeight.body;

  // Check if text would go beyond page boundary
  if (startY + totalTextHeight > pageHeight - pageMargin) {
    // If it doesn't fit, we need to split the text across pages
    let linesPerPage = Math.floor(
      (pageHeight - startY - pageMargin) / PDFStyles.spacing.lineHeight.body
    );
    // Ensure at least one line is printed (in case we're really close to bottom)
    linesPerPage = Math.max(linesPerPage, 1);

    // Print what fits on this page
    const firstPageLines = lines.slice(0, linesPerPage);
    doc.text(firstPageLines, pageMargin + indentation, startY);

    // Add a new page for the rest
    doc.addPage();

    // Print remaining lines on the new page
    const remainingLines = lines.slice(linesPerPage);
    if (remainingLines.length > 0) {
      doc.text(remainingLines, pageMargin + indentation, pageMargin);
      return (
        pageMargin +
        remainingLines.length * PDFStyles.spacing.lineHeight.body
      );
    }
    return pageMargin;
  } else {
    // If all text fits on current page
    doc.text(lines, pageMargin + indentation, startY);
    return startY + totalTextHeight;
  }
}

/**
 * Add company logo to PDF
 */
export async function addCompanyLogo(doc: jsPDF, logoUrl: string): Promise<void> {
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    const blob = await response.blob();
    const reader = new FileReader();

    await new Promise<void>((resolve, reject) => {
      reader.onload = () => {
        try {
          if (reader.result) {
            // Calculate dimensions to maintain aspect ratio
            const maxWidth = 40;
            const maxHeight = 20;
            const aspectRatio = 300 / 91; // Default aspect ratio
            let width = maxWidth;
            let height = width / aspectRatio;

            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }

            doc.addImage(
              reader.result as string,
              'PNG',
              pageMargin,
              pageMargin,
              width,
              height,
              undefined,
              'FAST'
            );
          }
          resolve();
        } catch (error) {
          reject(
            new Error(
              `Failed to add logo to PDF: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
        }
      };
      reader.onerror = () => reject(new Error('Failed to read logo file'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading company logo:', error);
    // Continue without logo
  }
}

/**
 * Add page numbers and footer to all pages
 */
export function addPageNumbersAndFooter(
  doc: jsPDF,
  companySettings: any,
  contractId?: string
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Add company details and page number in footer
    const footerParts = [];
    if (companySettings.company_number) {
      footerParts.push(`Company Number: ${companySettings.company_number}`);
    }
    if (companySettings.vat_number) {
      footerParts.push(`VAT Number: ${companySettings.vat_number}`);
    }
    if (contractId) {
      footerParts.push(`Contract ID: ${contractId}`);
    }

    if (footerParts.length > 0) {
      doc.setFontSize(PDFStyles.font.sizes.footer);
      doc.setTextColor(100);

      const footerText = footerParts.join('   ');
      const pageNumberText = `Page ${i} of ${pageCount}`;

      // Calculate positions
      const pageNumberWidth = doc.getTextWidth(pageNumberText);

      // Draw footer text on the left and page number on the right
      doc.text(footerText, pageMargin, pageHeight - 10); // Left margin
      doc.text(
        pageNumberText,
        pageWidth - pageNumberWidth - pageMargin,
        pageHeight - 10
      ); // Right margin
    }
  }
}
