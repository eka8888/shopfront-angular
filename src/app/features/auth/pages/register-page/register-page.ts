import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonType, ButtonVariant, InputType } from '../../../../shared/types/form.enums';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule,InputComponent,Button],
  templateUrl: './register-page.html'

})
export class RegisterPage {
    private router = inject(Router);
      readonly InputType = InputType;
  readonly ButtonType = ButtonType;
  readonly ButtonVariant = ButtonVariant;

  register(): void {
    console.log('User registered');

    this.router.navigate(['/login']);
  }
}
