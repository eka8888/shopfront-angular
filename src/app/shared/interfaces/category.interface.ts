export interface Category {
  id: number;
  name: string;
}

export interface CtProductCategory {
  id: string;
  typeId: 'category';
}

export interface CtCategories {
  results: CtCategory[];
}

export interface CtCategory {
  id: string;
  key: string;
  name: {
    'en-US': string;
  };
  slug: {
    'en-US': string;
  };
}
