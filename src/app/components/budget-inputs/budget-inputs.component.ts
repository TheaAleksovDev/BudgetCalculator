import { Component, effect, inject, input, signal } from '@angular/core';
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

@Component({
  selector: 'app-budget-inputs',
  standalone: true,
  imports: [FormsModule, AppShowByRoleDirective, CurrencyConvertPipe],
  templateUrl: './budget-inputs.component.html',
  styleUrl: './budget-inputs.component.css',
})
export class BudgetInputsComponent {
  rates = input.required<Rate[]>();

  role = input.required<Role>();
  private balanceService = inject(BalanceService);
  private settingsService = inject(SettingsService);

  balance = signal<Balance>({ amount: 0, currency: 'BGN' });
  amount = signal('');
  description = signal('');
  currency = signal<Currency>('BGN');

  constructor() {
    effect(
      () => {
        this.balance.set(this.balanceService.getBalance());
        this.currency.set(this.settingsService.getSelectedCurrency());
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
