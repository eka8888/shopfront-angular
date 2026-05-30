import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonType, ButtonVariant } from '../../types/form.enums';
@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variant: ButtonVariant = ButtonVariant.Outline;
  @Input() type: ButtonType = ButtonType.Button;
  @Input() fullWidth= false;
}
