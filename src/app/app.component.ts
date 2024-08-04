import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BudgetInputsComponent } from './components/budget-inputs/budget-inputs.component';
import { BudgetDisplayComponent } from './components/budget-display/budget-display.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';
import {
  currenciesListProvider,
  Rate,
  Role,
  rolesListProvider,
} from './models/budget-calculator.model';
import { ConversionRatesService } from './services/conversion-rates.service';
import { Subscription } from 'rxjs';
import { BalanceService } from './services/balance.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    BudgetInputsComponent,
    BudgetDisplayComponent,
    SettingsComponent,
  ],
  providers: [currenciesListProvider, rolesListProvider],
})
export class AppComponent {
  private settingsService = inject(SettingsService);
  private balanceService = inject(BalanceService);
  role = signal<Role>('admin');

  private conversionRatesService = inject(ConversionRatesService);

  USD_TO_BGN_CONVERSION_RATE = signal<Rate>(null);
  BGN_TO_USD_CONVERSION_RATE = signal<Rate>(null);
  usdToBgnSubscription!: Subscription;
  bgnToUsdSubscription!: Subscription;

  ngOnInit(): void {
    this.usdToBgnSubscription =
      this.conversionRatesService.USD_TO_BGN_CONVERSATION_RATE$.subscribe({
        next: (data) => {
          this.USD_TO_BGN_CONVERSION_RATE.set(data);
          this.balanceService.updateUSDtoBGN(data);
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    this.bgnToUsdSubscription =
      this.conversionRatesService.BGN_TO_USD_CONVERSION_RATE$.subscribe({
        next: (data) => {
          this.BGN_TO_USD_CONVERSION_RATE.set(data);
          this.balanceService.updateBGNtoUSD(data);
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.usdToBgnSubscription.unsubscribe();
    this.bgnToUsdSubscription.unsubscribe();
  }

  constructor() {
    effect(
      () => {
        this.role.set(this.settingsService.getSelectedRole());
      },
      { allowSignalWrites: true }
    );
  }
  title = 'budget-calculator';
}
