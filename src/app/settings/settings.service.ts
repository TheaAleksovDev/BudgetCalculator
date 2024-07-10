import { Injectable, signal } from '@angular/core';
import { Currency, Role } from '../models/budget-calculator.model';
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private selectedCurrency = signal<Currency>('BGN');
  private selectedRole = signal<Role>('admin');

  getSelectedCurrency() {
    return this.selectedCurrency();
  }

  getSelectedRole() {
    return this.selectedRole();
  }

  setSelectedCurrency(currency: Currency) {
    this.selectedCurrency.set(currency);
  }

  setSelectedRole(role: Role) {
    this.selectedRole.set(role);
  }
}
