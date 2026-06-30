import { Component, input, output, HostListener } from '@angular/core';
import { ButtonVariant, ButtonType } from '../../../../shared/types/form.enums';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-clear-cart-modal',
  imports: [Button],
  templateUrl: './clear-cart-modal.html',
  styleUrl: './clear-cart-modal.scss',
})
export class ClearCartModal {
  isOpen = input<boolean>(false);
  closed = output<void>();
  confirmed = output<void>();

  readonly ButtonVariant = ButtonVariant;
  readonly ButtonType = ButtonType;

  close() {
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }
}
