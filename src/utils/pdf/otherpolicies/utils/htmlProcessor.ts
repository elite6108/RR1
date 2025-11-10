/**
 * Converts HTML content to formatted text suitable for PDF generation
 * 
 * This function handles various HTML tags and entities, converting them
 * to plain text while preserving basic formatting like line breaks and lists.
 * 
 * @param html - The HTML string to convert
 * @returns Formatted plain text string
 */
export function htmlToFormattedText(html: string): string {
  if (!html) return '';
  
  let text = html;
  
  // Replace paragraph tags with double line breaks
  text = text.replace(/<\/p>\s*<p>/gi, '\n\n');
  text = text.replace(/<p[^>]*>/gi, '');
  text = text.replace(/<\/p>/gi, '\n\n');
  
  // Replace line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n');
  
  // Handle lists
  text = text.replace(/<\/li>\s*<li>/gi, '\n• ');
  text = text.replace(/<ul[^>]*>/gi, '\n');
  text = text.replace(/<\/ul>/gi, '\n');
  text = text.replace(/<ol[^>]*>/gi, '\n');
  text = text.replace(/<\/ol>/gi, '\n');
  text = text.replace(/<li[^>]*>/gi, '• ');
  text = text.replace(/<\/li>/gi, '\n');
  
  // Handle headers
  text = text.replace(/<h[1-6][^>]*>/gi, '\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n');
  
  // Handle divs
  text = text.replace(/<div[^>]*>/gi, '');
  text = text.replace(/<\/div>/gi, '\n');
  
  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  
  // Clean up extra whitespace and line breaks
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n'); // Replace multiple line breaks with double
  text = text.replace(/^\s+|\s+$/g, ''); // Trim leading/trailing whitespace
  
  return text;
}

/**
 * Parses content string to extract policy sections
 * 
 * Attempts to parse JSON content first, falls back to legacy single-section format
 * 
 * @param content - The content string to parse (JSON or plain text)
 * @returns Array of policy sections
 */
export function parseContentSections(content: string): Array<{id: string; title: string; content: string}> {
  let sections: Array<{id: string; title: string; content: string}> = [];
  
  try {
    const parsedContent = JSON.parse(content);
    if (Array.isArray(parsedContent)) {
      sections = parsedContent;
    } else {
      // Legacy format - treat as single section
      sections = [{
        id: 'legacy',
        title: 'Content',
        content: content
      }];
    }
  } catch {
    // If parsing fails, treat as legacy single content
    sections = [{
      id: 'legacy',
      title: 'Content',
      content: content
    }];
  }
  
  return sections;
}
