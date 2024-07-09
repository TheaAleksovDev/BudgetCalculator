import { Component, effect, inject, signal } from '@angular/core';
import { SettingsService } from './settings.service';
import { Currency } from '../interfaces/currency.type';
import { Role } from '../interfaces/role.type';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private settingsService = inject(SettingsService);
  role = signal<Role>('admin');
  currency = signal<Currency>('BGN');

  constructor() {
    effect(
      () => {
        this.role.set(this.settingsService.getSelectedRole());
        this.currency.set(this.settingsService.getSelectedCurrency());
      },
      { allowSignalWrites: true }
    );
  }

  setCurrency = (currency: Currency) => {
    this.settingsService.setSelectedCurrency(currency);
  };

  setRole = (role: Role) => {
    this.settingsService.setSelectedRole(role);
  };
}
