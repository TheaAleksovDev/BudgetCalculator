export type Currency = 'USD' | 'BGN';

export type Role = 'admin' | 'guest';

export interface Balance {
  amount: number;
  currency: Currency;
}

export interface Transaction {
  amount: number;
  currency: Currency;
  description: string;
}
