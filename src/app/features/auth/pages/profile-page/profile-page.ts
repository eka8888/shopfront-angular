import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-profile-page',
  imports: [],
  templateUrl: './profile-page.html'

})
export class ProfilePage {
    private authService = inject(Auth);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
