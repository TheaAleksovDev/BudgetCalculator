import { WritableSignal, inject, Injectable, signal } from '@angular/core';
import { Currency, Balance, Rate } from '../models/budget-calculator.model';
import { CurrencyConvertPipe } from '../currency.pipe';
import { Transaction } from '../models/budget-calculator.model';
import { nanoid } from 'nanoid';
import { ConversionRatesService } from './conversion-rates.service';

@Injectable({ providedIn: 'root' })
export class BalanceService {
  private currencyConvertPipe = inject(CurrencyConvertPipe);
  private conversionRatesService = inject(ConversionRatesService);
  private balance = signal<Balance>({ amount: 0, currency: 'BGN' });
  private incomes: WritableSignal<Transaction[]> = signal([]);
  private expenses: WritableSignal<Transaction[]> = signal([]);
  private USD_TO_BGN_CONVERSION_RATE = signal<Rate>(null);
  private BGN_TO_USD_CONVERSION_RATE = signal<Rate>(null);

  updateUSDtoBGN(newRate: Rate) {
    this.USD_TO_BGN_CONVERSION_RATE.set(newRate);
  }
  updateBGNtoUSD(newRate: Rate) {
    this.BGN_TO_USD_CONVERSION_RATE.set(newRate);
  }

  constructor() {
    this.conversionRatesService.updateConversionRates();

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
        currency,
        this.balance().currency,
        [this.USD_TO_BGN_CONVERSION_RATE(), this.BGN_TO_USD_CONVERSION_RATE()]
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
    const id = nanoid();
    this.incomes.update((incomes) => [
      ...incomes,
      {
        amount,
        currency,
        description,
        id,
      },
    ]);

    this.updateBalance(currency, amount, '+');
  };

  addExpense = (amount: number, currency: Currency, description: string) => {
    const id = nanoid();
    this.expenses.update((incomes) => [
      ...incomes,
      {
        amount,
        currency,
        description,
        id,
      },
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
