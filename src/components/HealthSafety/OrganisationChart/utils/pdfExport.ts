import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '../../../../lib/supabase';

export const exportToPDF = async (
  setGeneratingPdf: (value: boolean) => void,
  setLoading: (value: boolean) => void,
  setError: (value: string | null) => void
) => {
  setGeneratingPdf(true);
  const chart = document.getElementById('org-chart');
  if (!chart) {
    setGeneratingPdf(false);
    return;
  }
  try {
    setLoading(true);
    setError(null);

    // Get company settings
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { data: companySettings, error: settingsError } = await supabase
      .from('company_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError) throw settingsError;

    // Temporarily hide edit buttons for PDF export
    const editButtons = chart.querySelectorAll('button');
    editButtons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });

    // Apply a more aggressive temporary scaling transform
    const originalTransform = chart.style.transform;
    const originalPadding = chart.style.padding;
    
    // Apply a moderate scaling - not too small, not too large
    chart.style.transform = 'scale(0.7)';
    chart.style.transformOrigin = 'center top';
    
    // Adjust padding to tighten up the diagram
    chart.style.padding = '4px';

    // Generate chart image with higher scale for better quality
    const canvas = await html2canvas(chart, {
      scale: 2, // Scale at 2x for good quality without excessive size
      backgroundColor: '#f3f4f6',
    });

    // Restore original styling
    chart.style.transform = originalTransform;
    chart.style.padding = originalPadding;
    
    // Restore edit buttons
    editButtons.forEach(button => {
      (button as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Standard A4 dimensions in points (PDF uses 72 points per inch)
    // A4 is 297mm x 210mm - for landscape we flip these dimensions
    const pdf = new jsPDF({
      orientation: 'landscape', // Fixed landscape orientation
      unit: 'mm',
      format: 'a4', // Standard A4 format
    });

    // A4 landscape has 297mm width and 210mm height
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate margins (in mm)
    const leftMargin = 10;
    const topMargin = 15;
    const logoHeight = 12;
    
    // No extra space needed for title since it will be on same line as logo
    const headerHeight = topMargin + logoHeight;
    
    // Variables to track if logo was added
    let logoWidth = 0;
    let logoAdded = false;

    // Add company logo if exists
    if (companySettings?.logo_url) {
      try {
        const response = await fetch(companySettings.logo_url);
        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.statusText}`);
        }
        const blob = await response.blob();
        const reader = new FileReader();
        
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            try {
              if (reader.result) {
                // Calculate dimensions to maintain aspect ratio
                const aspectRatio = 300/91;
                const width = logoHeight * aspectRatio;
                
                pdf.addImage(
                  reader.result as string,
                  'PNG',
                  leftMargin,
                  topMargin,
                  width,
                  logoHeight,
                  undefined,
                  'FAST'
                );
                
                // Store logo width for title positioning
                logoWidth = width;
                logoAdded = true;
              }
              resolve(null);
            } catch (error) {
              reject(new Error(`Failed to add logo to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
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

    // Add title on the same line as logo
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    
    if (logoAdded) {
      // If logo is present, position title to the right of logo
      pdf.text('Organisation Chart', leftMargin + logoWidth + 5, topMargin + (logoHeight/2) + 1, { 
        align: 'left',
        baseline: 'middle'
      });
    } else {
      // If no logo, center title
      pdf.text('Organisation Chart', pdfWidth / 2, topMargin + 6, { 
        align: 'center',
        baseline: 'middle'
      });
    }

    // Calculate available space for the chart (accounting for margins)
    const availableWidth = pdfWidth - (leftMargin * 2);
    const availableHeight = pdfHeight - (headerHeight + topMargin);
    
    // Calculate image dimensions to fit while maintaining aspect ratio
    const imageRatio = canvas.width / canvas.height;
    let imageWidth = availableWidth;
    let imageHeight = imageWidth / imageRatio;
    
    // If the height is too large, constrain by height instead
    if (imageHeight > availableHeight) {
      imageHeight = availableHeight;
      imageWidth = imageHeight * imageRatio;
    }
    
    // Center the image horizontally
    const xPosition = leftMargin + (availableWidth - imageWidth) / 2;
    
    // Position the image
    pdf.addImage(
      imgData, 
      'PNG', 
      xPosition, 
      headerHeight + 5, // Position just below the header (logo and title)
      imageWidth,
      imageHeight
    );

    // Add footer with current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100); // Gray color
    pdf.text(
      `Accurate as of ${dateString}`, 
      pdfWidth / 2, 
      pdfHeight - 10, // 10mm from bottom
      { 
        align: 'center',
        baseline: 'bottom'
      }
    );
    
    pdf.save('organisation-chart.pdf');
  } catch (err) {
    console.error('Error exporting to PDF:', err);
    setError(err instanceof Error ? err.message : 'An error occurred while exporting to PDF');
  } finally {
    setLoading(false);
    setGeneratingPdf(false);
  }
};
