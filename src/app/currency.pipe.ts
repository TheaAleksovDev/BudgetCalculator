import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { Currency, Rate } from './models/budget-calculator.model';

@Injectable({ providedIn: 'root' })
@Pipe({
  name: 'convert',
  standalone: true,
})
export class CurrencyConvertPipe implements PipeTransform {
  transform(
    value: number,
    currency: Currency,
    convertToCurrency: Currency,
    rates: Rate[]
  ) {
    const USD_TO_BGN_CONVERSION_RATE = rates[0];
    const BGN_TO_USD_CONVERSION_RATE = rates[1];

    if (
      !value ||
      isNaN(value) ||
      USD_TO_BGN_CONVERSION_RATE === null ||
      BGN_TO_USD_CONVERSION_RATE === null
    ) {
      return null;
    }
    if (currency === convertToCurrency) {
      return value.toFixed(2);
    } else if (currency === 'USD' && convertToCurrency === 'BGN') {
      return (value * USD_TO_BGN_CONVERSION_RATE).toFixed(2);
    } else if (currency === 'BGN' && convertToCurrency === 'USD') {
      return (value * BGN_TO_USD_CONVERSION_RATE).toFixed(2);
    } else {
      return value.toFixed(2);
    }
  }
}
