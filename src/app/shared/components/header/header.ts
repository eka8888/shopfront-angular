import { Component, computed, inject } from '@angular/core';
import { SearchBar } from '../search-bar/search-bar';
import { Router, RouterLink,RouterLinkActive } from '@angular/router';
import { Button } from '../button/button';
import { Navigation } from '../../../core/services/navigation';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [SearchBar, RouterLink, RouterLinkActive, Button],
  templateUrl: './header.html',
  standalone: true,
})
export class Header {
  private navigationService = inject(Navigation);
    private authService = inject(Auth);
  private router = inject(Router);

  navItems = this.navigationService.navItems();
   isAuthenticated = computed(() =>
    this.authService.isAuthenticated()
  );

  handleSearch(value: string) {
    console.log(value);
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
