export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
};

type StoredExpense = {
  id: string;
  amountInCents: number;
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

type IdempotencyRecord = {
  expense: StoredExpense;
  payload: string;
};

export class IdempotencyConflictError extends Error {
  constructor() {
    super("IDEMPOTENCY_CONFLICT");
    this.name = "IdempotencyConflictError";
  }
}

class ExpenseStore {
  private expenses: StoredExpense[] = [];

  private idempotencyKeys = new Map<string, IdempotencyRecord>();

  list(): Expense[] {
    return this.expenses.map((expense) => this.toPublicExpense(expense));
  }

  findById(id: string): Expense | undefined {
    const expense = this.expenses.find((currentExpense) => currentExpense.id === id);

    if (!expense) {
      return undefined;
    }

    return this.toPublicExpense(expense);
  }

  findByIdempotencyKey(key: string): Expense | undefined {
    const expense = this.idempotencyKeys.get(key)?.expense;

    if (!expense) {
      return undefined;
    }

    return this.toPublicExpense(expense);
  }

  create(input: CreateExpenseInput, idempotencyKey?: string): Expense {
    const payload = JSON.stringify(input);

    if (idempotencyKey) {
      const existingRecord = this.idempotencyKeys.get(idempotencyKey);

      if (existingRecord) {
        if (existingRecord.payload !== payload) {
          throw new IdempotencyConflictError();
        }

        return this.toPublicExpense(existingRecord.expense);
      }
    }

    const expense: StoredExpense = {
      id: crypto.randomUUID(),
      amountInCents: Math.round(input.amount * 100),
      category: input.category,
      description: input.description,
      date: input.date,
      createdAt: new Date().toISOString(),
    };

    this.expenses.push(expense);

    if (idempotencyKey) {
      this.idempotencyKeys.set(idempotencyKey, {
        expense,
        payload,
      });
    }

    return this.toPublicExpense(expense);
  }

  clear(): void {
    this.expenses = [];
    this.idempotencyKeys.clear();
  }

  private toPublicExpense(expense: StoredExpense): Expense {
    return {
      id: expense.id,
      amount: expense.amountInCents / 100,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      createdAt: expense.createdAt,
    };
  }
}

export const expenseStore = new ExpenseStore();
