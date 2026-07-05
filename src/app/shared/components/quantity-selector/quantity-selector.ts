import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-quantity-selector',
  imports: [NgClass],
  templateUrl: './quantity-selector.html',
})
export class QuantitySelector {
  itemId = input.required<number | string>();
  itemQuantity = input.required<number>();

  increase = output<number | string>();
  decrease = output<number | string>();

  onIncrease() {
    this.increase.emit(this.itemId());
  }

  onDecrease() {
    this.decrease.emit(this.itemId());
  }
}
