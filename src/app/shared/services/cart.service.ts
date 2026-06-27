import { effect, inject, Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../interfaces/cart-item.interface';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private productService = inject(ProductService);

  discount = signal<number>(0);
  isDiscountApplied = computed(() => this.discount() > 0);

  readonly cartItems = signal<CartItem[]>([]);

  readonly itemsQuantity = computed(() => {
    const totalItems = this.cartItems().reduce((sum, item) => sum + item.quantity, 0);

    return totalItems;
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
    const savedDiscount = localStorage.getItem('savedDiscount');

    if (savedCart) {
      this.cartItems.set(JSON.parse(savedCart));
    }

    if (savedDiscount) {
      this.discount.set(JSON.parse(savedDiscount));
    }

    effect(() => {
      const itemsToSave = this.cartItems();

      localStorage.setItem('shopfrontCart', JSON.stringify(itemsToSave));
    });

    effect(() => {
      const discountToSave = this.discount();

      localStorage.setItem('savedDiscount', JSON.stringify(discountToSave));
    });
  }

  applyDiscount(percent: number) {
    if (percent >= 1 && percent <= 100) {
      this.discount.set(percent);
    } else {
      console.error('Invalid discount');
      return;
    }
  }
  resetDiscount() {
    this.discount.set(0);
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
