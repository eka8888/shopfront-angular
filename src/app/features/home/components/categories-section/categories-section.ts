import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";

import { CategoryService } from '../../../../shared/services/category.service';

@Component({
  selector: 'app-categories-section',
  imports: [RouterLink],
  templateUrl: './categories-section.html',
})
export class CategoriesSection {
  private categoryService = inject(CategoryService);

  categories = this.categoryService.getHomePageCategories();
}
