import productsData from './products.json';

export type Product = {
  id: string;
  name: string;
  price: number;
  tags: string[];
  description: string;
  imageUrls: string[];
  imageHint: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export const products: Product[] = productsData as Product[];
