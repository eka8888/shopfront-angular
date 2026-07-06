import { CtCategory } from "./category.interface";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  isNew: boolean;
  image?: string;
  detailedImage?: string;
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
  },
  categories?: CtCategory[],
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
  results: CtProduct[]
}
