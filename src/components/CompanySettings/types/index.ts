import React from 'react';

export type TabType = 'company' | 'contact' | 'insurances' | 'tax' | 'prefix';

export interface CompanySettingsFormProps {
  onClose: () => void;
}

export interface TabProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export interface LogoUploadProps {
  formData: any;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploadingLogo: boolean;
}