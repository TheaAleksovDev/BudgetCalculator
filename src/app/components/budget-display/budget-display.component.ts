import { Component, effect, WritableSignal } from '@angular/core';
import { inject, signal } from '@angular/core';
import { BalanceService } from '../budget-inputs/balance.service';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Transaction } from '../budget-inputs/balance.service';
@Component({
  selector: 'app-budget-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-display.component.html',
  styleUrl: './budget-display.component.css',
})
export class BudgetDisplayComponent {
  private balanceService = inject(BalanceService);

  incomes: WritableSignal<Transaction[]> = signal([]);
  expenses: WritableSignal<Transaction[]> = signal([]);

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
