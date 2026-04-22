export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
};

export type CreateExpenseInput = {
  amount: number;
  category: string;
  description: string;
  date: string;
};

class ExpenseStore {
  private expenses: Expense[] = [];

  private idempotencyKeys = new Map<string, Expense>();

  list(): Expense[] {
    return [...this.expenses];
  }

  findById(id: string): Expense | undefined {
    return this.expenses.find((expense) => expense.id === id);
  }

  findByIdempotencyKey(key: string): Expense | undefined {
    return this.idempotencyKeys.get(key);
  }

  create(input: CreateExpenseInput, idempotencyKey?: string): Expense {
    if (idempotencyKey) {
      const existingExpense = this.idempotencyKeys.get(idempotencyKey);

      if (existingExpense) {
        return existingExpense;
      }
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      amount: input.amount,
      category: input.category,
      description: input.description,
      date: input.date,
      createdAt: new Date().toISOString(),
    };

    this.expenses.push(expense);

    if (idempotencyKey) {
      this.idempotencyKeys.set(idempotencyKey, expense);
    }

    return expense;
  }

  clear(): void {
    this.expenses = [];
    this.idempotencyKeys.clear();
  }
}

export const expenseStore = new ExpenseStore();
