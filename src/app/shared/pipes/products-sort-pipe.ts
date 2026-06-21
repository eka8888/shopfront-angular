import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { Sorting } from '../types/sorting.enums';

@Pipe({
  name: 'productsSort',
})
export class ProductsSortPipe implements PipeTransform {
  transform(value: Product[], sortOption: Sorting = Sorting.NameAsc) {
    const sortedProducts = [...value];

    sortedProducts.sort((a, b) => {
      switch (sortOption) {
        case Sorting.NameAsc:
          return a.name.localeCompare(b.name);
        case Sorting.NameDesc:
          return b.name.localeCompare(a.name);
        case Sorting.PriceAsc:
          return a.price - b.price;
        case Sorting.PriceDesc:
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sortedProducts;
  }
}
