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
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const categoryOptions = Array.from(
    new Set(expenses.map((expense) => expense.category)),
  ).sort((firstCategory, secondCategory) =>
    firstCategory.localeCompare(secondCategory),
  );

  const visibleExpenses =
    selectedCategory === "all"
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

  const visibleTotal = visibleExpenses.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);

  if (isLoading) {
    return (
      <section className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-12 text-center shadow-xl backdrop-blur-xl">
        <div className="mx-auto flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400"></div>
        </div>
        <p className="mt-4 text-sm text-slate-300">
          Loading expenses...
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium text-red-300">{errorMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-cyan-500/5">
      <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white drop-shadow-sm">
            Recent Expenses
          </h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm text-slate-400">Total:</span>
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
              ${visibleTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 sm:min-w-[200px]">
          <label
            htmlFor="category-filter"
            className="text-xs font-medium uppercase tracking-wider text-slate-400"
          >
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-md transition-all focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          >
            <option value="all" className="bg-slate-900 text-white">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category} className="bg-slate-900 text-white">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-0">
        {visibleExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-white/5 p-3">
              <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No expenses found</h3>
            <p className="mt-1 text-sm text-slate-400">
              {expenses.length === 0
                ? "Get started by adding a new expense."
                : "Try changing your category filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {visibleExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="transition-colors hover:bg-white/10"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {expense.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-cyan-300 border border-blue-500/30">
                        {expense.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-white">
                      ${expense.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
