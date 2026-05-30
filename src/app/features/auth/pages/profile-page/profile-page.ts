import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../shared/components/button/button';
import { ButtonVariant } from '../../../../shared/types/form.enums';

@Component({
  selector: 'app-profile-page',
  imports: [FormsModule,Button],
  templateUrl: './profile-page.html'

})
export class ProfilePage {
  private authService = inject(Auth);
  private router = inject(Router);
  readonly ButtonVariant=ButtonVariant;

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
