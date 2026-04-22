import { ExpenseForm } from "@/components/ExpenseForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Expense Tracker
          </h1>
          <p className="text-sm text-zinc-600">
            Add and track personal expenses with a simple form.
          </p>
        </div>
        <ExpenseForm />
      </div>
    </main>
  );
}
