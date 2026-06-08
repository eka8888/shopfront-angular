import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-quantity-selector',
  imports: [NgClass],
  templateUrl: './quantity-selector.html',
})
export class QuantitySelector {
  itemId = input.required<number>();
  itemQuantity = input.required<number>();

  increase = output<number>();
  decrease = output<number>();

  onIncrease() {
    this.increase.emit(this.itemId());
  }

  onDecrease() {
    this.decrease.emit(this.itemId());
  }
}
