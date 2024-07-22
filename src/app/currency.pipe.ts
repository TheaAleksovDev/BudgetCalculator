import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { Currency } from './models/budget-calculator.model';
import {
  USD_TO_BGN_CONVERSATION_RATE,
  BGN_TO_USD_CONVERSION_RATE,
} from './conversion-rates';

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
      return value.toFixed(2);
    } else if (currency === 'USD' && convertToCurrency === 'BGN') {
      return (value * USD_TO_BGN_CONVERSATION_RATE).toFixed(2);
    } else if (currency === 'BGN' && convertToCurrency === 'USD') {
      return (value * BGN_TO_USD_CONVERSION_RATE).toFixed(2);
    } else {
      return value.toFixed(2);
    }
  }
}
