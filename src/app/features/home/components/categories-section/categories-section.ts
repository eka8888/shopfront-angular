import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";

import { CategoryService } from '../../../../shared/category.service';

@Component({
  selector: 'app-categories-section',
  imports: [RouterLink],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.scss',
})
export class CategoriesSection {
  private categoryService = inject(CategoryService);

  categories = this.categoryService.getCategories();
}
