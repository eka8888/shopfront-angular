import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  styleUrl: './select.scss',
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() options: { value: string; label: string }[] = [];

  value: string = '';
  isDisabled: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  handleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
