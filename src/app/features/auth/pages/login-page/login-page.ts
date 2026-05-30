import { Component, inject } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { Button } from "../../../../shared/components/button/button";
import { InputComponent } from '../../../../shared/components/input/input';
import { ButtonType, InputType } from '../../../../shared/types/form.enums';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [Button,InputComponent,FormsModule],
  templateUrl: './login-page.html'

})
export class LoginPage {
    private authService = inject(Auth);
    private router = inject(Router);
    readonly InputType = InputType;
    readonly ButtonType=ButtonType;

  login(): void {
      console.log('LOGIN CLICKED');
    this.authService.login();

    this.router.navigate(['/profile']);
  }
}
