import { inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { WritableSignal } from '@angular/core';
import { Currency } from '../../interfaces/currency.type';
import { Balance } from '../../interfaces/balance.interface';
import { CurrencyConvertPipe } from '../../currency.pipe';
export interface Transaction {
  amount: number;
  currency: Currency;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class BalanceService {
  private currencyConvertPipe = inject(CurrencyConvertPipe);

  private balance = signal<Balance>({ amount: 0, currency: 'BGN' });
  private incomes: WritableSignal<Transaction[]> = signal([]);
  private expenses: WritableSignal<Transaction[]> = signal([]);
  constructor() {
    this.loadBalance();
    this.loadTransactions();
  }

  getBalance = () => {
    return this.balance();
  };

  getIncomes = () => {
    return this.incomes();
  };
  getExpenses = () => {
    return this.expenses();
  };

  updateBalance(currency: Currency, amount: number, operator: '+' | '-') {
    if (this.balance().currency === currency) {
      this.balance.update((balance) => {
        return operator === '+'
          ? { ...balance, amount: balance.amount + amount }
          : { ...balance, amount: balance.amount - amount };
      });
    } else {
      let convertedValue = this.currencyConvertPipe.transform(
        amount,
        this.balance().currency,
        currency
      );

      if (convertedValue) {
        this.balance.update((balance) => {
          return operator === '+'
            ? { ...balance, amount: balance.amount + +convertedValue }
            : { ...balance, amount: balance.amount - +convertedValue };
        });
      }
    }
  }

  addIncome = (amount: number, currency: Currency, description: string) => {
    this.incomes.update((incomes) => [
      ...incomes,
      { amount: amount, currency: currency, description: description },
    ]);

    this.updateBalance(currency, amount, '+');
  };

  addExpense = (amount: number, currency: Currency, description: string) => {
    this.expenses.update((incomes) => [
      ...incomes,
      { amount: amount, currency: currency, description: description },
    ]);
    this.updateBalance(currency, amount, '+');
  };

  saveBalance = () => {
    localStorage.setItem('balance', JSON.stringify(this.balance()));
  };
  saveTransactions = () => {
    localStorage.setItem('incomes', JSON.stringify(this.incomes()));
    localStorage.setItem('expenses', JSON.stringify(this.expenses()));
  };

  loadBalance = () => {
    const savedBalance = localStorage.getItem('balance');
    if (savedBalance) {
      this.balance.set(JSON.parse(savedBalance));
    }
  };

  loadTransactions = () => {
    const savedIncomes = localStorage.getItem('incomes');
    if (savedIncomes) {
      try {
        this.incomes.set(JSON.parse(savedIncomes));
      } catch (e) {
        console.error(e);
        this.incomes.set([]);
      }
    }
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        this.expenses.set(JSON.parse(savedExpenses));
      } catch (e) {
        console.error(e);
        this.expenses.set([]);
      }
    }
  };

  addTransaction = (
    amount: string,
    currency: Currency,
    description: string
  ) => {
    const amountValue = +amount;
    if (amountValue && description) {
      if (amountValue < 0) {
        this.addExpense(amountValue, currency, description);
      } else {
        this.addIncome(amountValue, currency, description);
      }
      this.saveBalance();
      this.saveTransactions();
    }
  };
  deleteTransaction = (selectedTransaction: Transaction) => {
    const amountValue = +selectedTransaction.amount;
    if (selectedTransaction) {
      if (amountValue < 0) {
        this.updateBalance(selectedTransaction.currency, amountValue, '-');

        const updatedExpenses = this.expenses().filter(
          (transaction) => transaction !== selectedTransaction
        );

        this.expenses.set(updatedExpenses);
      } else {
        this.updateBalance(selectedTransaction.currency, amountValue, '-');

        const updatedIncomes = this.incomes().filter(
          (transaction) => transaction !== selectedTransaction
        );

        this.incomes.set(updatedIncomes);
      }
      this.saveBalance();
      this.saveTransactions();
    }
  };
}
