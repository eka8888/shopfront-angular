import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebase.config';
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
  styleUrl: './newsletter.scss',
})
export class Newsletter {
  private firestore = firestore;

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
      await addDoc(collection(this.firestore, 'subscribers'), {
        email: this.emailControl.value,
        subscribedAt: new Date(),
      });
      this.state = SubmitState.Success;
      this.form.reset();
    } catch {
      this.state = SubmitState.Error;
    }
  }
}
