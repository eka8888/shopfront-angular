import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details-page',
  imports: [CurrencyPipe],
  templateUrl: './product-details-page.html',
})
export class ProductDetailsPage {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  productId = Number(this.route.snapshot.paramMap.get('id'));
  imagePath = this.productService.getProductDetailsImage(this.productId);

  currentProduct = computed(() => {
    return this.productService.getProductById(this.productId);
  });

  oldPrice = computed(() => {
    return this.productService.getOldPrice(this.productId);
  });
}
