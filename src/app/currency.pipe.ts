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
    // console.log(value, currency, convertToCurrency);
    if (currency === convertToCurrency) {
      return value.toFixed(2);
    } else if (currency === 'USD' && convertToCurrency === 'BGN') {
      return (value * 1.75).toFixed(2);
    } else if (currency === 'BGN' && convertToCurrency === 'USD') {
      return (value * 0.57).toFixed(2);
    } else {
      return value.toFixed(2);
    }
  }
}
