import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailSubscriptionService } from '../../../../shared/services/email-subscription.service';
import { InputComponent } from '../../../../shared/components/input/input';
import {
  ButtonType,
  ButtonVariant,
  InputType,
  InputVariant,
  SubmitState,
} from '../../../../shared/types/form.enums';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-newsletter',
  imports: [InputComponent, Button, ReactiveFormsModule],
  templateUrl: './newsletter.html',
})
export class Newsletter {
  private emailService = inject(EmailSubscriptionService);

  readonly SubmitState = SubmitState;
  readonly InputVariant = InputVariant;
  readonly ButtonVariant = ButtonVariant;
  readonly InputType = InputType;
  readonly ButtonType = ButtonType;

  state: SubmitState = SubmitState.Idle;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get emailControl() {
    return this.form.controls.email;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state = SubmitState.Loading;

    try {
      await this.emailService.subscribe(this.emailControl.value!);
      this.state = SubmitState.Success;
      this.form.reset();
    } catch {
      this.state = SubmitState.Error;
    }
  }
}
