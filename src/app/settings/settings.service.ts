import { Injectable, signal } from '@angular/core';
import { Currency } from '../interfaces/currency.type';
import { Role } from '../interfaces/role.type';
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
