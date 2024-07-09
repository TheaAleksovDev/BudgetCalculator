import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { Currency } from './interfaces/currency.type';

@Injectable({ providedIn: 'root' })
@Pipe({
  name: 'convert',
  standalone: true,
})
export class CurrencyConvertPipe implements PipeTransform {
  transform(value: number, currency: Currency, convertToCurrency: Currency) {
    if (!value || isNaN(value)) {
      return null;
    }
    if (currency === convertToCurrency) {
      return value.toFixed(0);
    } else if (convertToCurrency === 'BGN' && currency === 'USD') {
      return (value * 1.75).toFixed(0);
    } else if (convertToCurrency === 'USD' && currency === 'BGN') {
      return (value * 0.57).toFixed(0);
    } else {
      return value.toFixed(0);
    }
  }
}
