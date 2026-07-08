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

  increase = output<string>();
  decrease = output<string>();

  onIncrease() {
    this.increase.emit(this.itemId());
  }

  onDecrease() {
    this.decrease.emit(this.itemId());
  }
}
