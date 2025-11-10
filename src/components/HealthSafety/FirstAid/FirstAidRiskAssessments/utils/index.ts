export * from './constants';

// Risk calculation utilities
export const calculateRiskScore = (severity: number, likelihood: number): number => {
  return severity * likelihood;
};

export const getRiskLevel = (riskScore: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (riskScore <= 4) return 'low';
  if (riskScore <= 9) return 'medium';
  if (riskScore <= 16) return 'high';
  return 'critical';
};

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'low': return 'green';
    case 'medium': return 'yellow';
    case 'high': return 'orange';
    case 'critical': return 'red';
    default: return 'gray';
  }
};