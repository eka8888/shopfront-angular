import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-quantity-selector',
  imports: [NgClass],
  templateUrl: './quantity-selector.html',
})
export class QuantitySelector {
  itemId = input.required<string>();
  itemQuantity = input.required<number>();
  disabled = input<boolean>(false);

  increase = output<string>();
  decrease = output<string>();

  onIncrease() {
    if (this.disabled()) {
      return;
    }

    this.increase.emit(this.itemId());
  }

  onDecrease() {
    if (this.disabled()) {
      return;
    }

    this.decrease.emit(this.itemId());
  }
}
