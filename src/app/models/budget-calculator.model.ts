import { InjectionToken, Provider } from '@angular/core';

export type Currency = 'USD' | 'BGN';

export type Role = 'admin' | 'guest';

export interface Balance {
  amount: number;
  currency: Currency;
}

export type Rate = number | null;

export interface Transaction {
  amount: number;
  currency: Currency;
  description: string;
  id: string;
}

interface CurrencyObject {
  currency: Currency;
  isAvailable: boolean;
}

interface RoleObject {
  role: Role;
  isAvailable: boolean;
}

//currencies
export const CURRENCIES_LIST = new InjectionToken<CurrencyObject[]>(
  'currencies-list'
);

export const CurrenciesList = [
  { currency: 'BGN', isAvailable: true },
  { currency: 'USD', isAvailable: true },
  { currency: 'RSD', isAvailable: false },
];

export const currenciesListProvider: Provider = {
  provide: CURRENCIES_LIST,
  useValue: CurrenciesList,
};

//roles
export const ROLES_LIST = new InjectionToken<RoleObject[]>('roles-list');

export const RolesList = [
  { role: 'admin', isAvailable: true },
  { role: 'guest', isAvailable: true },
  { role: 'developer', isAvailable: false },
];

export const rolesListProvider: Provider = {
  provide: ROLES_LIST,
  useValue: RolesList,
};
