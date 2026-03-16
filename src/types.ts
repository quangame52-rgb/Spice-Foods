export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'seasoning' | 'dipping' | 'powder' | 'hotpot';
  weight?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface SiteSettings {
  aboutUs: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  heroTitle: string;
  heroSubtitle: string;
  logo?: string;
  storyTitle?: string;
  storyContent?: string;
  storyImage?: string;
  storyImages?: string[];
  storyVideoUrl?: string;
  storyMediaType?: 'image' | 'video' | 'gallery';
  updatedAt: string;
}
