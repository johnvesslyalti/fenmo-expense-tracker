"use client";

import { useRef, useState } from "react";

type ExpenseFormData = {
  amount: string;
  category: string;
  description: string;
  date: string;
};

type ExpenseFormProps = {
  onSuccess?: () => void;
};

const initialFormData: ExpenseFormData = {
  amount: "",
  category: "",
  description: "",
  date: "",
};

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const keyRef = useRef<string | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (!keyRef.current) {
        keyRef.current = crypto.randomUUID();
      }

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": keyRef.current,
        },
        body: JSON.stringify({
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json()) as { error?: string };
        throw new Error(errorBody.error ?? "Failed to create expense.");
      }

      setFormData(initialFormData);
      keyRef.current = null;
      onSuccess?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create expense.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-cyan-500/10"
    >
      <h2 className="text-lg font-semibold text-white drop-shadow-sm">Add New Expense</h2>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="amount"
          className="text-sm font-medium text-slate-300"
        >
          Amount
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-400 sm:text-sm">$</span>
          </div>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="block w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-7 pr-3 text-sm text-white placeholder:text-slate-400 backdrop-blur-md transition-all focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="category"
          className="text-sm font-medium text-slate-300"
        >
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. Food, Transport"
          className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 backdrop-blur-md transition-all focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description"
          rows={3}
          className="block w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 backdrop-blur-md transition-all focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="date"
          className="text-sm font-medium text-slate-300"
        >
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-md transition-all focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 [color-scheme:dark]"
          required
        />
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 backdrop-blur-md">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSubmitting ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}
