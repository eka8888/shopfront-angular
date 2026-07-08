import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CtCategories, CtCategory } from '../interfaces/category.interface';
import { stripTrailingSlash } from '../../core/utils/url';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private BASE_URL = `${stripTrailingSlash(environment.apiUrl)}/${environment.projectKey}/categories`;

  private httpClient = inject(HttpClient);

  allCategories = signal<CtCategory[]>([]);

  homePageCategories = signal(
    this.allCategories().map((category) => {
      const slug = category.name['en-US']
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

  getHomePageCategories() {
    return this.homePageCategories;
  }

  fetchCategories() {
    const url = `${this.BASE_URL}`;

    return this.httpClient.get<CtCategories>(url).pipe(map((data) => data.results));
  }
}
