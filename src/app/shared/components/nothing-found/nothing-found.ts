import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nothing-found',
  imports: [RouterLink],
  templateUrl: './nothing-found.html',
})
export class NothingFound {
  message = input<string>();
  btnText = input.required<string>();
  btnLink = input.required<string>();
}
