import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AIGuidelinesHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGuidelines: (guidelines: string) => void;
  assessmentDetails: {
    name: string;
    location: string;
    assessor: string;
    selectedPPE: string[];
  };
}

export function AIGuidelinesHelper({ isOpen, onClose, onApplyGuidelines, assessmentDetails }: AIGuidelinesHelperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedGuidelines, setGeneratedGuidelines] = useState<string | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };

  const generateDefaultPrompt = () => {
    const { name, location, selectedPPE } = assessmentDetails;
    
    let prompt = `Generate safety guidelines for a risk assessment with the following details:\n`;
    prompt += `Task: ${name}\n`;
    prompt += `Location: ${location}\n`;
    
    if (selectedPPE.length > 0) {
      prompt += `\nSelected PPE: ${selectedPPE.join(', ')}\n`;
    }
    
    prompt += `\nPlease provide comprehensive safety guidelines that cover general safety practices, specific precautions for this type of work, and any regulatory requirements that should be followed.`;
    
    return prompt;
  };

  const handleGenerateGuidelines = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = aiPrompt || generateDefaultPrompt();
      
      // Make the actual API call to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a health and safety expert specializing in risk assessments. Your task is to generate comprehensive safety guidelines for a workplace risk assessment document. These guidelines will be used as a reference for workers conducting the specified task or activity.\n\nYour guidelines should include:\n\n1. General Safety Principles - Overarching safety practices applicable to all work activities\n2. PPE Requirements - Detailed specifications for personal protective equipment needed\n3. Task-Specific Guidelines - Specific safety procedures related to the task described\n4. Legal and Regulatory Requirements - Relevant health and safety regulations that apply\n5. Emergency Procedures - Steps to take in case of accidents or incidents\n6. Review and Monitoring - How often the guidelines should be reviewed\n\nYour response must be thorough, practical, and compliant with current health and safety standards. Format your response as a well-structured document with clear headings, bullet points, and numbered lists where appropriate. Use markdown formatting for better readability."
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
      const guidelinesText = data.choices[0].message.content;
      setGeneratedGuidelines(guidelinesText);
    } catch (err) {
      console.error('Error generating guidelines:', err);
      setError('Failed to generate guidelines. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleApplyGuidelines = () => {
    if (generatedGuidelines) {
      onApplyGuidelines(generatedGuidelines);
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Guidelines Assistant</h2>
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
              Use AI to help generate comprehensive safety guidelines for your risk assessment.
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
              onClick={handleGenerateGuidelines}
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Guidelines...
                </>
              ) : (
                'Generate Guidelines with AI'
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

          {generatedGuidelines && (
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Generated Guidelines</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {generatedGuidelines}
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyGuidelines}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Apply Guidelines
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}