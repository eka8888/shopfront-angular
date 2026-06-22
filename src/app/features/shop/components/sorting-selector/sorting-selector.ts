import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SelectComponent } from '../../../../shared/components/select/select';
import { DEFAULT_SORTING, Sorting, isSorting } from '../../../../shared/types/sorting.enums';

@Component({
  selector: 'app-sorting-selector',
  imports: [ReactiveFormsModule, SelectComponent],
  templateUrl: './sorting-selector.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortingSelector implements OnInit {
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  sortSelect = output<Sorting>();

  sortOptions: { value: Sorting; label: string }[] = [
    { value: Sorting.NameAsc, label: 'Name ↑' },
    { value: Sorting.NameDesc, label: 'Name ↓' },
    { value: Sorting.PriceAsc, label: 'Price ↑' },
    { value: Sorting.PriceDesc, label: 'Price ↓' },
  ];

  sortingForm = this.formBuilder.group({
    sortBy: [DEFAULT_SORTING],
  });

  ngOnInit(): void {
    const sortByControl = this.sortingForm.get('sortBy');
    const defaultValue = sortByControl?.value;

    if (defaultValue && isSorting(defaultValue)) {
      this.sortSelect.emit(defaultValue);
    }

    const subscription = sortByControl?.valueChanges.subscribe((value) => {
      if (value && isSorting(value)) {
        this.sortSelect.emit(value);
      }
    });

    this.destroyRef.onDestroy(() => subscription?.unsubscribe());
  }
}
