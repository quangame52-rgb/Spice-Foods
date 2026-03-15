export interface Product {
  id: string;
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
