import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../button/button';
import { ButtonVariant } from '../../types/form.enums';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Button],
  templateUrl: './not-found.html',
})
export class NotFound {
  readonly ButtonVariant = ButtonVariant;
}
