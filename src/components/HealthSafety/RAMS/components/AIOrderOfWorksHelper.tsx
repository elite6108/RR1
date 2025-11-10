import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AIOrderOfWorksHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyOrderOfWorks: (orderOfWorks: string) => void;
  ramsDetails: {
    description?: string;
    sequence?: string;
  };
}

export function AIOrderOfWorksHelper({ isOpen, onClose, onApplyOrderOfWorks, ramsDetails }: AIOrderOfWorksHelperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedOrderOfWorks, setGeneratedOrderOfWorks] = useState<string | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };

  const generateDefaultPrompt = () => {
    const { description, sequence } = ramsDetails;
    
    let prompt = `Generate a detailed custom order of works for a RAMS (Risk Assessment and Method Statement)`;
    
    if (description) {
      prompt += ` for the following work:\n${description}\n`;
    }
    
    if (sequence) {
      prompt += `\nOperational Sequence: ${sequence}\n`;
    }
    
    prompt += `\nPlease provide a comprehensive custom order of works that covers:\n`;
    prompt += `1. Detailed task breakdown and sequencing\n`;
    prompt += `2. Resource allocation and scheduling\n`;
    prompt += `3. Quality control checkpoints\n`;
    prompt += `4. Safety considerations at each stage\n`;
    prompt += `5. Coordination with other trades/activities\n`;
    prompt += `6. Material handling and logistics\n`;
    prompt += `7. Completion criteria for each phase\n`;
    
    prompt += `\nEnsure the order of works is logical, practical, and follows HSE UK regulations and construction best practices. Each step should be clearly defined with specific deliverables and timeframes where appropriate.`;
    
    return prompt;
  };

  const handleGenerateOrderOfWorks = async () => {
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
              content: "You are a UK construction project management expert specializing in creating detailed order of works for Risk Assessment and Method Statements (RAMS). Your task is to generate a comprehensive, sequenced order of works that ensures efficient project delivery while maintaining safety and quality standards in compliance with HSE UK regulations.\n\nYour order of works should include:\n\n1. Task Sequencing - Logical progression of work activities\n2. Resource Planning - Personnel, equipment, and material requirements\n3. Quality Control - Inspection and testing points\n4. Safety Integration - Safety measures embedded in each phase, HSE compliance\n5. Coordination Points - Interface with other trades and activities\n6. Logistics Planning - Material delivery, storage, and handling\n7. Milestone Definitions - Clear completion criteria and deliverables\n8. Contingency Considerations - Alternative approaches for potential issues\n\nYour response must be thorough, practical, and fully compliant with HSE UK regulations, CDM regulations, and current UK construction and project management standards. Format your response as a well-structured document with clear numbering, phases, and logical flow. Do not include project-specific details like client names, site managers, or assessors in the output - focus purely on the order of works. Use markdown formatting for better readability."
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
      const orderOfWorksText = data.choices[0].message.content;
      setGeneratedOrderOfWorks(orderOfWorksText);
    } catch (err) {
      console.error('Error generating order of works:', err);
      setError('Failed to generate order of works. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyOrderOfWorks = () => {
    if (generatedOrderOfWorks) {
      onApplyOrderOfWorks(generatedOrderOfWorks);
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Custom Order of Works Assistant</h2>
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
              Use AI to help generate a detailed custom order of works for your RAMS based on the project details.
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
              onClick={handleGenerateOrderOfWorks}
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Custom Order of Works...
                </>
              ) : (
                'Generate Custom Order of Works with AI'
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

          {generatedOrderOfWorks && (
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Generated Custom Order of Works</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {generatedOrderOfWorks}
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyOrderOfWorks}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Apply Custom Order of Works
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
