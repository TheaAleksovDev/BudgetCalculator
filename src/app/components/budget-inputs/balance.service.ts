import { Injectable, SimpleChanges } from '@angular/core';
import { signal } from '@angular/core';
import { WritableSignal } from '@angular/core';
export interface Transaction {
  amount: number;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class BalanceService {
  private balance = signal(0);
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

  addIncome = (amount: number, description: string) => {
    this.incomes.update((incomes) => [
      ...incomes,
      { amount: amount, description: description },
    ]);
    this.balance.update((balance) => balance + amount);
  };

  addExpense = (amount: number, description: string) => {
    this.expenses.update((incomes) => [
      ...incomes,
      { amount: amount, description: description },
    ]);
    this.balance.update((balance) => balance + amount);
  };

  saveBalance = () => {
    localStorage.setItem('balance', this.balance().toString());
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
        console.error('Error parsing incomes:', e);
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

  addTransaction = (amount: string, description: string) => {
    const amountValue = +amount;
    if (amountValue && description) {
      if (amountValue < 0) {
        this.addExpense(amountValue, description);
      } else {
        this.addIncome(amountValue, description);
      }
      this.saveBalance();
      this.saveTransactions();
    }
  };
  deleteTransaction = (selectedTransaction: Transaction) => {
    const amountValue = +selectedTransaction.amount;
    if (selectedTransaction) {
      if (amountValue < 0) {
        this.balance.update((balance) => balance - amountValue);
        const updatedExpenses = this.expenses().filter(
          (transaction) => transaction !== selectedTransaction
        );
        this.expenses.set(updatedExpenses);
      } else {
        this.balance.update((balance) => balance - amountValue);
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
