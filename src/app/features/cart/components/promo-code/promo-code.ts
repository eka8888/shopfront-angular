import { Component, input, output, HostListener, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SubmitState,
  InputVariant,
  ButtonVariant,
  InputType,
  ButtonType,
} from '../../../../shared/types/form.enums';
import { InputComponent } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { PromoCodeService } from '../../../../shared/services/promo-code-service';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-promo-code',
  imports: [InputComponent, Button, ReactiveFormsModule],
  templateUrl: './promo-code.html',
  styleUrl: './promo-code.scss',
})
export class PromoCode {
  isOpen = input<boolean>(false);
  closed = output<void>();
  totalChanged = output<number>();

  private promoCodeService = inject(PromoCodeService);
  private cartService = inject(CartService);

  promoCodes = this.promoCodeService.getPromoCode();
  isDiscountApplied = this.cartService.isDiscountApplied;

  readonly SubmitState = SubmitState;
  readonly InputVariant = InputVariant;
  readonly ButtonVariant = ButtonVariant;
  readonly InputType = InputType;
  readonly ButtonType = ButtonType;

  state: SubmitState = SubmitState.Idle;

  form = new FormGroup({
    code: new FormControl(''),
  });

  close() {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.close();
      event.preventDefault();
    }
  }

  get promoControl() {
    return this.form.controls.code;
  }

  calculateDiscount(discount: number, price: number) {
    return Math.max(0, price * (1 - discount / 100));
  }

  applyPromoCode() {
    if (this.isDiscountApplied()) return;
    const code = this.form.controls.code.value;

    if (!code) {
      this.form.markAllAsTouched();
      return;
    }

    const promo = this.promoCodes.find((p) => p.promo === code);

    if (!promo) {
      this.state = SubmitState.Error;
      return;
    }

    try {
      this.totalChanged.emit(promo.discount);
      this.state = SubmitState.Success;
      this.isDiscountApplied.set(true);
      this.form.reset();
    } catch {
      this.state = SubmitState.Error;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }
}
