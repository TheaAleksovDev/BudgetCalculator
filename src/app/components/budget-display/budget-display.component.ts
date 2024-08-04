import {
  Component,
  effect,
  input,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { BalanceService } from '../../services/balance.service';
import { CommonModule } from '@angular/common';
import { AppShowByRoleDirective } from '../../show-by-role.directive';
import { HighlightByAmount } from '../../highlight-by-amount.directive';
import { CurrencyConvertPipe } from '../../currency.pipe';
import { SettingsService } from '../../settings/settings.service';
import {
  Currency,
  Rate,
  Role,
  Transaction,
} from '../../models/budget-calculator.model';

@Component({
  selector: 'app-budget-display',
  standalone: true,
  imports: [
    CommonModule,
    AppShowByRoleDirective,
    HighlightByAmount,
    CurrencyConvertPipe,
  ],
  templateUrl: './budget-display.component.html',
  styleUrl: './budget-display.component.css',
})
export class BudgetDisplayComponent {
  role = input.required<Role>();
  rates = input.required<[Rate, Rate]>();
  private balanceService = inject(BalanceService);
  private settingsService = inject(SettingsService);

  incomes: WritableSignal<Transaction[]> = signal([]);
  expenses: WritableSignal<Transaction[]> = signal([]);
  currency: WritableSignal<Currency> = signal('BGN');

  deleteTransaction = (transaction: Transaction) => {
    this.balanceService.deleteTransaction(transaction);
  };

  constructor() {
    effect(
      () => {
        this.incomes.set(this.balanceService.getIncomes());
        this.expenses.set(this.balanceService.getExpenses());
        this.currency.set(this.settingsService.getSelectedCurrency());
      },
      { allowSignalWrites: true }
    );
  }
}
