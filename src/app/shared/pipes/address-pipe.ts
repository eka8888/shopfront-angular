import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'address',
})
export class AddressPipe implements PipeTransform {
  transform(
    street: string,
    city: string,
    country: string
  ): string {
    return `${street}, ${city}, ${country}`;
  }
}
