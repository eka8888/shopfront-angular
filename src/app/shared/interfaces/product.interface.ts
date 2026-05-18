export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  isNew: boolean;
  image?: string;
}
