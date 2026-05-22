import { Component, Input, signal } from '@angular/core';
import { SearchVariant } from '../../types/form.enums';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchComponent {
  @Input() variant: SearchVariant = SearchVariant.Field;
  @Input() placeholder: string = 'Search for product...';

  isOpen = signal(false);

  toggle() {
    this.isOpen.set(!this.isOpen());
  }
}
