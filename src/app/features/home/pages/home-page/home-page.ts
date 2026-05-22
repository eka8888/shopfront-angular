import { Component } from '@angular/core';


import { HeroSection } from '../../components/hero-section/hero-section';
import { CategoriesSection } from '../../components/categories-section/categories-section';
import { PromoSection } from '../../components/promo-section/promo-section';
import { NewArrivalsSection } from '../../components/new-arrivals-section/new-arrivals-section';

@Component({
  selector: 'app-home-page',
  imports: [HeroSection, CategoriesSection, PromoSection, NewArrivalsSection],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: true,
})
export class HomePage {}
