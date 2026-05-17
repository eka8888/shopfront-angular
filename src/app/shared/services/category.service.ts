import { Injectable, signal } from '@angular/core';

import categoriesData from '../data/categories.json';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categories = signal(
    categoriesData.map((category) => {
      const slug = category.name
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      return {
        ...category,
        image: `images/categories-section/${slug}.jpg`,
        slug,
      };
    }),
  );

  getCategories() {
    return this.categories;
  }
}
