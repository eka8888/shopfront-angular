import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SearchBar } from '../search-bar/search-bar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '../button/button';
import { Navigation } from '../../../core/services/navigation';
import { Auth } from '../../../core/services/auth';
import { ButtonVariant } from '../../types/form.enums';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { SearchService } from '../../services/search.service';
import { CartApi } from '../../../core/services/cart-api';
import { CartStore } from '../../../core/stores/cart.store';
@Component({
  selector: 'app-header',
  imports: [SearchBar, RouterLink, RouterLinkActive, Button],
  templateUrl: './header.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly ButtonVariant = ButtonVariant;

  private navigationService = inject(Navigation);
  private authService = inject(Auth);
  private router = inject(Router);
  private appConfig = inject(APP_CONFIG);
  private searchService = inject(SearchService);
  private cartApi = inject(CartApi);
  private cartStore = inject(CartStore);

  readonly appName = this.appConfig.appName;
  readonly navItems = this.navigationService.navItems();
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly searchBarValue = this.searchService.userInput;
  readonly cartBadge = this.cartStore.itemsCount;

  constructor() {
    this.cartApi.loadActiveCart().subscribe();
  }

  handleSearch(value: string): void {
    this.searchService.searchProducts(value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
