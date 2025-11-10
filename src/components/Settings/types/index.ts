import React from 'react';

export type TabType = 'modules' | 'domains' | 'tokens' | 'password';

export interface ModulesConfig {
  admin: boolean;
  customersAndProjects: boolean;
  purchaseOrders: boolean;
  quotes: boolean;
  healthAndSafety: boolean;
  training: boolean;
  reporting: boolean;
}

export interface ModulesModalProps {
  onClose: () => void;
  modules: ModulesConfig;
  onModuleChange: (module: keyof ModulesConfig, value: boolean) => void;
}

export interface Token {
  id: string;
  domain_name: string;
  token: string | null;
}

export interface Domain {
  id: string;
  domain_name: string;
}

export interface AuthFormProps {
  onAuthenticated: () => void;
}

export interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export interface ModulesTabProps {
  modules: ModulesConfig;
  onModuleChange: (module: keyof ModulesConfig, value: boolean) => void;
}

export interface DomainsTabProps {
  domains: Domain[];
  newDomain: string;
  setNewDomain: (domain: string) => void;
  onAddDomain: () => void;
  onDeleteDomain: (domain: Domain) => void;
  loading: boolean;
}

export interface TokensTabProps {
  domains: Domain[];
  tokens: Token[];
  onGenerateToken: (domainName: string) => void;
  loading: boolean;
}

export interface PasswordTabProps {
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  passwordError: string;
  passwordSuccess: string;
  loading: boolean;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  domainToDelete: string;
  onConfirm: () => void;
  onCancel: () => void;
}