export type IconName = 
  | 'erp' | 'retail' | 'hr' | 'support' | 'marketing' | 'payment' 
  | 'finance' | 'communication' | 'office' | 'crm' | 'design' 
  | 'collaboration' | 'project' | 'video' | 'ai' | 'brain' | 'robot' | 'default';

export interface Software {
    name: string;
    description: string;
    tags: string[];
    price: string;
    iconClass: IconName;
    brazilian: boolean;
    website: string;
    rating: number;
    userCount: string;
}

export type FilterOption = 'todos' | 'ia' | 'empresarial' | 'gratuitos' | 'pagos' | 'brasileiros';

export interface Filter {
    id: FilterOption;
    label: string;
}

export interface NewsArticle {
    title: string;
    summary: string;
    url: string;
    imageUrl: string;
    category: string;
    source: string;
}