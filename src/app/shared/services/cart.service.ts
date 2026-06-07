import { effect, inject, Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../interfaces/cart-item.interface';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private productService = inject(ProductService);

  readonly cartItems = signal<CartItem[]>([]);

  readonly cartHeading = computed(() => {
    const totalItems = this.cartItems().reduce((sum, item) => sum + item.quantity, 0);

    const heading = totalItems === 1 ? `${totalItems} item` : `${totalItems} items`;

    return heading;
  });

  readonly cartTotal = computed(() => {
    const items = this.cartItems();

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return total;
  });

  constructor() {
    const savedCart = localStorage.getItem('shopfrontCart');

    if (savedCart) {
      this.cartItems.set(JSON.parse(savedCart));
    }

    effect(() => {
      const itemsToSave = this.cartItems();

      localStorage.setItem('shopfrontCart', JSON.stringify(itemsToSave));
    });
  }

  addToCart(productId: number): void {
    const currentProduct = this.productService.getProductById(productId);

    if (!currentProduct) {
      console.error(`Product with id ${productId} not found`);
      return;
    }

    this.cartItems.update((items) => {
      const addedItem = items.find((item) => item.id === productId);

      if (addedItem) {
        return items.map((item) => {
          if (item.id === productId) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          return item;
        });
      }

      const newItem = {
        ...currentProduct,
        quantity: 1,
      };

      return [...items, newItem];
    });
  }

  removeFromCart(productId: number) {
    this.cartItems.update((items) => {
      return items.filter((item) => item.id !== productId);
    });
  }

  increaseQuantity(productId: number) {
    this.cartItems.update((items) => {
      return items.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return item;
      });
    });
  }

  decreaseQuantity(productId: number) {
    this.cartItems.update((items) => {
      return items.map((item) => {
        if (item.id === productId && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      });
    });
  }
}
