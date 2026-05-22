import { Component, Input } from '@angular/core';
import { InputType, InputVariant } from '../../types/form.enums';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [NgClass],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: InputType = InputType.Text;
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() variant: InputVariant = InputVariant.Default;
}
