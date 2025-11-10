import { WorkerUser } from '../types/workerDashboardTypes';

// Function to check if a health questionnaire is needed
// If a user completed one in the last 6 months, they don't need a new one
export const isHealthQuestionnaireNeeded = (user: WorkerUser | null): boolean => {
  // Get the last_health_questionnaire date from worker data
  const lastHealthQuestionnaire = user?.last_health_questionnaire;

  console.log(
    'Checking if health questionnaire is needed. Last date:',
    lastHealthQuestionnaire
  );

  if (!lastHealthQuestionnaire) {
    console.log('No previous health questionnaire found, one is needed');
    return true; // No questionnaire completed yet
  }

  // Convert string date to Date object
  const lastCompletionDate = new Date(lastHealthQuestionnaire);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Debug log
  console.log('Last completion:', lastCompletionDate.toISOString());
  console.log('Six months ago:', sixMonthsAgo.toISOString());
  console.log('Is questionnaire needed:', lastCompletionDate < sixMonthsAgo);

  // Return true if last completion was more than 6 months ago
  return lastCompletionDate < sixMonthsAgo;
};

// Add a more robust method to check if we have a valid questionnaire
export const hasValidHealthQuestionnaire = (user: WorkerUser | null): boolean => {
  return !!user?.last_health_questionnaire;
};

// Helper function to format the signed date
export const formatSignedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};