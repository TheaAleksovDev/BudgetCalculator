import { HttpClient } from '@angular/common/http';
import { Injectable, inject, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  interval,
  map,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConversionRatesService implements OnDestroy {
  USD_TO_BGN_CONVERSATION_RATE$ = new BehaviorSubject<number | null>(null);
  BGN_TO_USD_CONVERSION_RATE$ = new BehaviorSubject<number | null>(null);
  ratesInterval = new BehaviorSubject<number | null>(null);

  private httpClient = inject(HttpClient);
  private conversionRatesSubscription!: Subscription;

  getSavedInterval() {
    const savedRatesInterval = localStorage.getItem('ratesInterval');
    if (savedRatesInterval !== null) {
      this.ratesInterval.next(+savedRatesInterval);
    } else {
      this.ratesInterval.next(300000);
    }
  }

  updateInterval(newInterval: number) {
    this.ratesInterval.next(newInterval);
    this.saveInterval();
    this.conversionRatesSubscription.unsubscribe();
    this.updateConversionRates();
  }

  saveInterval() {
    localStorage.setItem('ratesInterval', String(this.ratesInterval.value));
  }

  updateConversionRates() {
    this.getSavedInterval();

    if (this.ratesInterval.value !== null) {
      this.conversionRatesSubscription = interval(this.ratesInterval.value)
        .pipe(
          startWith(0),
          switchMap(() => this.fetchConversionRates())
        )
        .subscribe({
          next: (res) => {
            const toBGN = res[0].BGN || null;
            const toUSD = res[1].USD || null;
            this.USD_TO_BGN_CONVERSATION_RATE$.next(toBGN);
            this.BGN_TO_USD_CONVERSION_RATE$.next(toUSD);
          },
          error(err) {
            console.log(err);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.conversionRatesSubscription.unsubscribe();
  }

  fetchConversionRates() {
    const usd_to_bgn$ = this.httpClient
      .get<{ data: { BGN: number } }>(
        'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_iABAhfr7f63xkW5ud8iisyHzrFjVcaCrLY0ePVbq&currencies=BGN'
      )
      .pipe(map((res) => res.data));

    const bgn_to_usd$ = this.httpClient
      .get<{ data: { USD: number } }>(
        'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_iABAhfr7f63xkW5ud8iisyHzrFjVcaCrLY0ePVbq&currencies=USD&base_currency=BGN'
      )
      .pipe(map((res) => res.data));

    return forkJoin([usd_to_bgn$, bgn_to_usd$]);
  }
}
