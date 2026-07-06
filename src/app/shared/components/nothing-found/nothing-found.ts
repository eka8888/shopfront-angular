import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../button/button';
import { ButtonVariant } from '../../types/form.enums';

@Component({
  selector: 'app-nothing-found',
  imports: [RouterLink, Button],
  templateUrl: './nothing-found.html',
  styleUrl: './nothing-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NothingFound {
  readonly ButtonVariant = ButtonVariant;

  message = input<string>();
  btnText = input.required<string>();
  btnLink = input<string>();
  btnClick = output<void>();
}
