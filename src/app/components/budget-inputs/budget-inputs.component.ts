import { CommonModule } from '@angular/common';
import { Component, effect, inject, NgModule, signal } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BalanceService } from './balance.service';
import { OnInit } from '@angular/core';
import { computed } from '@angular/core';
@Component({
  selector: 'app-budget-inputs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './budget-inputs.component.html',
  styleUrl: './budget-inputs.component.css',
})
export class BudgetInputsComponent {
  private balanceService = inject(BalanceService);

  balance = signal(0);
  amount = signal('');
  description = signal('');

  constructor() {
    effect(
      () => {
        this.balance.set(this.balanceService.getBalance());
      },
      { allowSignalWrites: true }
    );
  }

  addTransaction = () => {
    this.balanceService.addTransaction(this.amount(), this.description());
    this.amount.set('');
    this.description.set('');
  };
}
