export interface PolicySection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface PolicyContent {
  sections: PolicySection[];
}

export interface PolicyTemplate {
  [key: string]: string;
}