import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AIOperationalSequenceHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySequence: (sequence: string) => void;
  ramsDetails: {
    description?: string;
  };
}

export function AIOperationalSequenceHelper({ isOpen, onClose, onApplySequence, ramsDetails }: AIOperationalSequenceHelperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedSequence, setGeneratedSequence] = useState<string | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };

  const generateDefaultPrompt = () => {
    const { description } = ramsDetails;
    
    let prompt = `Generate a detailed operational sequence for a RAMS (Risk Assessment and Method Statement)`;
    
    if (description) {
      prompt += ` for the following work:\n${description}\n`;
    } else {
      prompt += `.\n`;
    }
    
    prompt += `\nPlease provide a comprehensive operational sequence that covers:\n`;
    prompt += `1. Pre-work preparation and site setup\n`;
    prompt += `2. Step-by-step work methodology\n`;
    prompt += `3. Quality checks and inspections\n`;
    prompt += `4. Completion and handover procedures\n`;
    prompt += `5. Clean-up and site restoration\n`;
    
    prompt += `\nEnsure the sequence is logical, detailed, and complies with HSE UK regulations and health and safety best practices. Each step should be clear and actionable for the work crew.`;
    
    return prompt;
  };

  const handleGenerateSequence = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = aiPrompt || generateDefaultPrompt();
      
      // Make the actual API call to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(import.meta as any).env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a UK construction and health & safety expert specializing in creating detailed operational sequences for Risk Assessment and Method Statements (RAMS). Your task is to generate a comprehensive, step-by-step operational sequence that ensures safe and efficient completion of construction work in compliance with HSE UK regulations.\n\nYour operational sequence should include:\n\n1. Pre-Work Preparation - Site setup, safety briefings, equipment checks, permit to work procedures\n2. Work Methodology - Detailed step-by-step procedures for completing the work safely\n3. Quality Control - Inspection points and quality checks throughout the process\n4. Safety Considerations - Ongoing safety measures, monitoring, and HSE compliance\n5. Completion Procedures - Final checks, handover, and documentation\n6. Clean-up and Restoration - Site cleanup and restoration to original condition\n\nYour response must be thorough, practical, and fully compliant with HSE UK regulations, CDM regulations, and current UK construction and health & safety standards. Format your response as a well-structured document with clear numbering, bullet points, and logical flow. Do not include project-specific details like client names, site managers, or assessors in the output - focus purely on the operational sequence. Use markdown formatting for better readability."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Get the response text
      const sequenceText = data.choices[0].message.content;
      setGeneratedSequence(sequenceText);
    } catch (err) {
      console.error('Error generating operational sequence:', err);
      setError('Failed to generate operational sequence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySequence = () => {
    if (generatedSequence) {
      onApplySequence(generatedSequence);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 z-50"></div>
      <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl p-6 max-w-4xl w-full m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Operational Sequence Assistant</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Use AI to help generate a detailed operational sequence for your RAMS based on the description of works.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customize your prompt (optional)
              </label>
              <textarea
                value={aiPrompt}
                onChange={handlePromptChange}
                placeholder={generateDefaultPrompt()}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <button
              onClick={handleGenerateSequence}
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Operational Sequence...
                </>
              ) : (
                'Generate Operational Sequence with AI'
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {generatedSequence && (
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Generated Operational Sequence</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {generatedSequence}
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySequence}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Apply Operational Sequence
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
