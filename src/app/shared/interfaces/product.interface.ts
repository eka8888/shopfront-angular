import { CtProductCategory } from './category.interface';

export interface Product {
  id: string;
  ctId: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  image?: string;
  detailedImage?: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface CtProduct {
  id: string;
  key: string;
  masterVariant: {
    prices: Price[];
    images?: Image[];
  };
  name: {
    'en-US': string;
  };
  description: {
    'en-US': string;
  };
  categories?: CtProductCategory[];
  createdAt: string;
  lastModifiedAt: string;
}

interface Price {
  value: {
    centAmount: number;
    currencyCode: string;
  };
}

interface Image {
  url: string;
}

export interface CtAllProducts {
  count: number;
  limit: number;
  offset: number;
  total: number;
  results: CtProduct[];
}
