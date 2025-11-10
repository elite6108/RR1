import { supabase } from '../../../../lib/supabase';
import type { Section, OrgChartData, OrgChartEmployee } from '../types';

// Helper function to fetch org chart data
export async function fetchOrgChartData(userId: string): Promise<OrgChartData> {
  try {
    const { data: orgData, error: orgError } = await supabase
      .from('organization_chart')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (orgError) throw orgError;

    const { data: reportingLines, error: reportingError } = await supabase
      .from('reporting_lines')
      .select('*')
      .eq('user_id', userId);

    if (reportingError) throw reportingError;

    return { orgData: orgData || [], reportingLines: reportingLines || [] };
  } catch (error) {
    console.error('Error fetching org chart data:', error);
    return { orgData: [], reportingLines: [] };
  }
}

// Helper function to build org chart tree
export function buildOrgChart(employees: any[], parentId: string | null = null): OrgChartEmployee[] {
  return employees
    .filter(emp => emp.parent_id === parentId)
    .map(emp => ({
      ...emp,
      children: buildOrgChart(employees, emp.id)
    }));
}

// Helper function to parse content into sections
export function parseSections(htmlContent: string): Section[] {
  const sections: Section[] = [];
  const sectionRegex = /<h[1-6]>(.*?)<\/h[1-6]>([\s\S]*?)(?=<h[1-6]>|$)/gi;
  let match;

  while ((match = sectionRegex.exec(htmlContent)) !== null) {
    sections.push({
      header: match[1].trim(),
      content: cleanAndFormatContent(match[2])
    });
  }

  return sections;
}

// Helper function to clean HTML and format text
export function cleanAndFormatContent(htmlContent: string): string {
  return htmlContent
    // Handle HTML entities first
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Handle paragraphs with double line breaks
    .replace(/<p\s*[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    // Handle unordered lists with bottom margin
    .replace(/<ul\s*[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n\n')  // Added extra \n for bottom margin
    // Handle ordered lists with bottom margin
    .replace(/<ol\s*[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n\n')  // Added extra \n for bottom margin
    // Handle list items with proper indentation, bullets and spacing
    .replace(/<li\s*[^>]*>/gi, '\n    • ')
    .replace(/<\/li>/gi, '\n')  // Add newline after each list item for spacing
    // Handle line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Handle divs with line breaks
    .replace(/<div\s*[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    // Remove any other HTML tags
    .replace(/<[^>]+>/g, '')
    // Fix multiple consecutive line breaks (more than 2)
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    // Ensure proper indentation for list items that might have lost formatting
    .replace(/^•/gm, '    •')
    // Remove any trailing/leading whitespace
    .trim();
}

// Helper function to process organization structure content
export async function processOrganizationStructure(): Promise<string> {
  // Get user ID from company settings
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch org chart data
  const { data: orgData, error: orgError } = await supabase
    .from('organization_chart')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (orgError) throw orgError;

  // Start with the introductory paragraph
  let finalContent = `The organisation structure illustrates the hierarchical structure and reporting relationships within our company regarding health and safety responsibilities. Each position shown on the chart has specific duties and accountabilities in maintaining our health and safety standards.\n\n`;

  // Build org chart tree and add to content
  if (orgData && orgData.length > 0) {
    const rootEmployees = buildOrgChart(orgData);
    
    // Add employee information with proper indentation
    const addEmployeeInfo = (employee: any, level: number = 0) => {
      const indent = '    '.repeat(level);
      if (employee.name || employee.title) {
        finalContent += `${indent}• ${employee.name || ''}${employee.title ? ' - ' + employee.title : ''}\n`;
      }
      employee.children.forEach((child: any) => addEmployeeInfo(child, level + 1));
    };

    rootEmployees.forEach(emp => addEmployeeInfo(emp));
  }

  return finalContent;
}

// Helper function to add company logo to PDF
export async function addCompanyLogo(doc: any, logoUrl: string): Promise<void> {
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise((resolve, reject) => {
      reader.onload = () => {
        try {
          if (reader.result) {
            const maxWidth = 40;
            const maxHeight = 20;
            const aspectRatio = 300/91;
            let width = maxWidth;
            let height = width / aspectRatio;
            
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }

            doc.addImage(
              reader.result as string,
              'PNG',
              15,
              15,
              width,
              height,
              undefined,
              'FAST'
            );
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
    throw error;
  }
}

// Define theme colors and styles
export const pdfStyles = {
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  borderColor: [211, 211, 211] as [number, number, number], // Light gray border
  greenColor: '#6dd187'
};
