"use client";

import { useEffect, useState } from "react";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
};

type ExpenseListProps = {
  refreshTrigger?: number;
};

export function ExpenseList({ refreshTrigger = 0 }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadExpenses() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/expenses");

      if (!response.ok) {
        throw new Error("Failed to load expenses.");
      }

      const data = (await response.json()) as Expense[];
      setExpenses(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load expenses.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadExpenses();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Loading expenses...
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Expenses
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {expenses.length} total
        </span>
      </div>

      {expenses.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          No expenses yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-3 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Amount
                </th>
                <th className="px-3 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Category
                </th>
                <th className="px-3 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Description
                </th>
                <th className="px-3 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-900"
                >
                  <td className="px-3 py-3 text-zinc-900 dark:text-zinc-50">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-zinc-700 dark:text-zinc-200">
                    {expense.category}
                  </td>
                  <td className="px-3 py-3 text-zinc-700 dark:text-zinc-200">
                    {expense.description}
                  </td>
                  <td className="px-3 py-3 text-zinc-700 dark:text-zinc-200">
                    {expense.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
