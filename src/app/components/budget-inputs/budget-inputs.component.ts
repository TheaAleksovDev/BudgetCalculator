import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  NgModule,
  signal,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BalanceService } from './balance.service';
import { OnInit } from '@angular/core';
import { computed } from '@angular/core';
import { AppShowByRoleDirective } from '../../show-by-role.directive';
import { Role } from '../../interfaces/role.type';
@Component({
  selector: 'app-budget-inputs',
  standalone: true,
  imports: [FormsModule, AppShowByRoleDirective],
  templateUrl: './budget-inputs.component.html',
  styleUrl: './budget-inputs.component.css',
})
export class BudgetInputsComponent {
  role = input.required<Role>();
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
