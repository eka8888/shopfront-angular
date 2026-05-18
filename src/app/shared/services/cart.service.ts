import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  addToCart(productId: number): void {
    console.log('Product added to cart:', productId);
  }
}
