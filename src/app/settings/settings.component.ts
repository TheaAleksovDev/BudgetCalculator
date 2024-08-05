import { Component, computed, inject } from '@angular/core';
import { SettingsService } from './settings.service';
import {
  CURRENCIES_LIST,
  ROLES_LIST,
  Currency,
  Role,
} from '../models/budget-calculator.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private settingsService = inject(SettingsService);

  //currencies
  allCurrencies = inject(CURRENCIES_LIST);

  currency = computed(() => {
    return this.settingsService.getSelectedCurrency();
  });

  //roles
  allRoles = inject(ROLES_LIST);

  role = computed(() => {
    return this.settingsService.getSelectedRole();
  });

  setCurrency = (currency: Currency) => {
    this.settingsService.setSelectedCurrency(currency);
  };

  setRole = (role: Role) => {
    this.settingsService.setSelectedRole(role);
  };
}
