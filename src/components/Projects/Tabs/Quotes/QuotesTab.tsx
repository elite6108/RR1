import React from 'react';
import { QuotesList } from '../../../Quotes';
import type { Project, Quote } from '../../../../types/database';

interface QuotesTabProps {
  project: Project;
  quotes: Quote[];
  onQuoteChange: () => void;
  isLoading: boolean;
}

export function QuotesTab({ project, quotes, onQuoteChange, isLoading }: QuotesTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Filter quotes to only show those belonging to the current project
  const projectQuotes = quotes.filter(quote => quote.project_id === project.id);

  return (
    <QuotesList
      quotes={projectQuotes}
      onQuoteChange={onQuoteChange}
      onBack={() => {}} // This is handled by the parent component
      hideBreadcrumbs={true}
      preselectedProject={project}
      disableProjectSelection={true}
    />
  );
} 