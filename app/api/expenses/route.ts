import { expenseStore } from "@/lib/expense-store";

type CreateExpenseRequest = {
  amount: number;
  category: string;
  description: string;
  date: string;
};

export async function POST(request: Request) {
  let body: CreateExpenseRequest;

  try {
    body = (await request.json()) as CreateExpenseRequest;
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body.amount !== "number" || body.amount <= 0) {
    return Response.json(
      { error: "Amount must be greater than 0." },
      { status: 400 },
    );
  }

  try {
    const expense = expenseStore.create(
      body,
      request.headers.get("Idempotency-Key") ?? undefined,
    );

    return Response.json(expense, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "IDEMPOTENCY_CONFLICT") {
      return Response.json(
        { error: "Idempotency key reused with different payload" },
        { status: 409 },
      );
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let expenses = expenseStore.list();

  if (category) {
    const normalizedCategory = category.toLowerCase();
    expenses = expenses.filter(
      (expense) => expense.category.toLowerCase() === normalizedCategory,
    );
  }

  if (sort === "date") {
    expenses = [...expenses].sort((firstExpense, secondExpense) => {
      return (
        new Date(secondExpense.date).getTime() -
        new Date(firstExpense.date).getTime()
      );
    });
  }

  return Response.json(expenses);
}
