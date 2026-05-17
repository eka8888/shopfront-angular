import { Component } from '@angular/core';

import { ProductCard } from "../../../../shared/components/product-card/product-card";
import { Product } from '../../../../shared/interfaces/product.interface';
import { HeroSection } from '../../components/hero-section/hero-section';
import { CategoriesSection } from '../../components/categories-section/categories-section';
import { PromoSection } from '../../components/promo-section/promo-section';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, HeroSection, CategoriesSection, PromoSection],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone:true
})
export class HomePage {
    products: Product[] = [
    {
      id: 1,
      title: 'Nike Shoes',
      price: 120,
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 2,
      title: 'Adidas Hoodie',
      price: 80,
      image: 'https://via.placeholder.com/200',
    },
  ];

  handleAddToCart(productId: number): void {
    console.log('Product added to cart:', productId);
  }
}
