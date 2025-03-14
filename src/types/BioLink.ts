export interface BioLink {
    id: string;
    title: string;
    url: string;
    enabled: boolean;
    icon?: string;
    order: number;
  }
  
  export interface BioLinkPage {
    id: string;
    title: string;
    description?: string;
    links: BioLink[];
    slug: string;
    theme: 'light' | 'dark' | 'custom';
    primaryColor?: string;
    backgroundColor?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  