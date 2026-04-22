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

type IdempotencyRecord = {
  expense: Expense;
  payload: string;
};

export class IdempotencyConflictError extends Error {
  constructor() {
    super("IDEMPOTENCY_CONFLICT");
    this.name = "IdempotencyConflictError";
  }
}

class ExpenseStore {
  private expenses: Expense[] = [];

  private idempotencyKeys = new Map<string, IdempotencyRecord>();

  list(): Expense[] {
    return [...this.expenses];
  }

  findById(id: string): Expense | undefined {
    return this.expenses.find((expense) => expense.id === id);
  }

  findByIdempotencyKey(key: string): Expense | undefined {
    return this.idempotencyKeys.get(key)?.expense;
  }

  create(input: CreateExpenseInput, idempotencyKey?: string): Expense {
    const payload = JSON.stringify(input);

    if (idempotencyKey) {
      const existingRecord = this.idempotencyKeys.get(idempotencyKey);

      if (existingRecord) {
        if (existingRecord.payload !== payload) {
          throw new IdempotencyConflictError();
        }

        return existingRecord.expense;
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
      this.idempotencyKeys.set(idempotencyKey, {
        expense,
        payload,
      });
    }

    return expense;
  }

  clear(): void {
    this.expenses = [];
    this.idempotencyKeys.clear();
  }
}

export const expenseStore = new ExpenseStore();
