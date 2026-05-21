import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonType, ButtonVariant } from '../../types/button.types';
@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variant: ButtonVariant = 'outline';
  @Input() type: ButtonType = 'button';
  @Input() fullWidth: boolean = false;
}
