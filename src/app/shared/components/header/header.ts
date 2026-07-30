import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SearchBar } from '../search-bar/search-bar';
import { Button } from '../button/button';

import { Navigation } from '../../../core/services/navigation';
import { Auth } from '../../../core/services/auth';
import { APP_CONFIG } from '../../../core/config/app-config.token';

import { SearchService } from '../../services/search.service';
import { CartService } from '../../services/cart.service';
import { ButtonVariant } from '../../types/form.enums';
import { CartStore } from '../../../core/stores/cart.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBar, RouterLink, RouterLinkActive, Button],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly ButtonVariant = ButtonVariant;

  private readonly navigationService = inject(Navigation);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly appConfig = inject(APP_CONFIG);
  private readonly searchService = inject(SearchService);
  private readonly cartService = inject(CartService);
  private cartStore = inject(CartStore);

  readonly appName = this.appConfig.appName;
  readonly navItems = this.navigationService.navItems();

  readonly isAuthenticated = this.authService.isAuthenticated;

  readonly searchBarValue = this.searchService.userInput;

  readonly cartBadge = this.cartStore.itemsCount;

  readonly mobileMenuOpen = signal(false);

  handleSearch(value: string): void {
    this.searchService.searchProducts(value);
  }

  handleMobileSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.handleSearch(value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((isOpen) => !isOpen);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
