"use client";

import { useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <main className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900/90 to-blue-950/40 px-4 py-8 sm:px-6 lg:px-8 sm:py-12 relative overflow-hidden text-slate-50">
      {/* Decorative Background Shapes */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]"></div>
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]"></div>

      <div className="mx-auto max-w-5xl space-y-8 relative z-10">
        <header className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow-sm">
            Expense Tracker
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Easily manage and track your personal expenses.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 relative">
          <div className="lg:col-span-4">
            <ExpenseForm
              onSuccess={() => {
                setRefreshTrigger((currentValue) => currentValue + 1);
              }}
            />
          </div>
          <div className="lg:col-span-8">
            <ExpenseList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </main>
  );
}
