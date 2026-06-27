import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plurals',
})
export class PluralsPipe implements PipeTransform {
  transform(quantity: number, singular: string, plural: string) {
    return quantity === 1 ? `${quantity} ${singular}` : `${quantity} ${plural}`;
  }
}
