export interface RiskAssessment {
  ra_id: string;
  creation_date: string;
  location: string;
  assessor: string;
  ppe: string[];
  guidelines?: string;
  working_methods: Array<{
    number: number;
    description: string;
  }>;
  hazards: Array<{
    title: string;
    whoMightBeHarmed: string;
    howMightBeHarmed: string;
    beforeLikelihood: number;
    beforeSeverity: number;
    beforeTotal: number;
    afterLikelihood: number;
    afterSeverity: number;
    afterTotal: number;
    controlMeasures: Array<{
      description: string;
    }>;
  }>;
}

export interface GeneratePDFOptions {
  assessment: RiskAssessment;
  companySettings: import('../../../../types/database').CompanySettings;
}
