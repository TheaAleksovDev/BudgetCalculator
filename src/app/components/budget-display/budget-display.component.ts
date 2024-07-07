import { Component, effect, input, WritableSignal } from '@angular/core';
import { inject, signal } from '@angular/core';
import { BalanceService } from '../budget-inputs/balance.service';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Transaction } from '../budget-inputs/balance.service';
import { AppShowByRoleDirective } from '../../show-by-role.directive';
import { Role } from '../../interfaces/role.type';
@Component({
  selector: 'app-budget-display',
  standalone: true,
  imports: [CommonModule, AppShowByRoleDirective],
  templateUrl: './budget-display.component.html',
  styleUrl: './budget-display.component.css',
})
export class BudgetDisplayComponent {
  role = input.required<Role>();

  private balanceService = inject(BalanceService);

  incomes: WritableSignal<Transaction[]> = signal([]);
  expenses: WritableSignal<Transaction[]> = signal([]);

  deleteTransaction = (transaction: Transaction) => {
    this.balanceService.deleteTransaction(transaction);
  };

  constructor() {
    effect(
      () => {
        this.incomes.set(this.balanceService.getIncomes());
        this.expenses.set(this.balanceService.getExpenses());
      },
      { allowSignalWrites: true }
    );
  }
}
