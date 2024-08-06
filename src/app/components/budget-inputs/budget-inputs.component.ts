import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BalanceService } from '../../services/balance.service';
import { AppShowByRoleDirective } from '../../show-by-role.directive';
import { SettingsService } from '../../settings/settings.service';
import { CurrencyConvertPipe } from '../../currency.pipe';
import {
  Currency,
  Balance,
  Role,
  Rate,
} from '../../models/budget-calculator.model';
import { ConversionRatesService } from '../../services/conversion-rates.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-budget-inputs',
  standalone: true,
  imports: [FormsModule, AppShowByRoleDirective, CurrencyConvertPipe],
  templateUrl: './budget-inputs.component.html',
  styleUrl: './budget-inputs.component.css',
})
export class BudgetInputsComponent implements OnInit, OnDestroy {
  rates = input.required<[Rate, Rate]>();
  role = input.required<Role>();
  private balanceService = inject(BalanceService);
  private settingsService = inject(SettingsService);
  private conversionRatesService = inject(ConversionRatesService);

  balance = signal<Balance>({ amount: 0, currency: 'BGN' });
  amount = signal('');
  description = signal('');
  currency = signal<Currency>('BGN');

  ratesIntervalSubscription!: Subscription;
  ratesInterval = signal<null | number>(null);
  intervalInputEnabled = signal(false);
  intervalInputError = signal(false);
  @ViewChild('intervalInput')
  intervalInputElement!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.ratesIntervalSubscription =
      this.conversionRatesService.ratesInterval$.subscribe({
        next: (value) => {
          this.ratesInterval.set(value);
        },
      });
  }

  ngOnDestroy(): void {
    this.ratesIntervalSubscription.unsubscribe();
  }

  onChangeIntervalClick() {
    const timeValue = this.ratesInterval();
    if (timeValue && timeValue < 10000) {
      return;
    }

    if (timeValue !== null) {
      this.conversionRatesService.updateInterval(timeValue);
    }

    this.intervalInputEnabled.update((prev) => !prev);
    setTimeout(() => {
      if (this.intervalInputEnabled()) {
        this.intervalInputElement.nativeElement.focus();
      }
    }, 1);
  }

  constructor() {
    effect(
      () => {
        this.balance.set(this.balanceService.getBalance());
        this.currency.set(this.settingsService.getSelectedCurrency());
        const interval = this.ratesInterval();
        if (interval !== null && interval >= 10000) {
          this.intervalInputError.set(false);
        } else {
          this.intervalInputError.set(true);
        }
      },
      { allowSignalWrites: true }
    );
  }

  addTransaction = () => {
    this.balanceService.addTransaction(
      this.amount(),
      this.currency(),
      this.description()
    );
    this.amount.set('');
    this.description.set('');
  };
}
