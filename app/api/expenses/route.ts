import { expenseStore } from "@/lib/expense-store";

type CreateExpenseRequest = {
  amount: number;
  category: string;
  description: string;
  date: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

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

  if (typeof body.amount !== "number" || !Number.isFinite(body.amount)) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (body.amount <= 0) {
    return Response.json(
      { error: "Amount must be greater than 0." },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(body.category)) {
    return Response.json(
      { error: "Category must be a non-empty string." },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(body.description)) {
    return Response.json(
      { error: "Description must be a non-empty string." },
      { status: 400 },
    );
  }

  if (!isValidDateString(body.date)) {
    return Response.json(
      { error: "Date must be a valid date string." },
      { status: 400 },
    );
  }

  try {
    const expense = expenseStore.create(
      {
        amount: body.amount,
        category: body.category.trim().toLowerCase(),
        description: body.description.trim(),
        date: body.date,
      },
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

  let expenses = expenseStore.list();

  if (category) {
    const normalizedCategory = category.toLowerCase();
    expenses = expenses.filter(
      (expense) => expense.category.toLowerCase() === normalizedCategory,
    );
  }

  expenses = [...expenses].sort((firstExpense, secondExpense) => {
    return (
      new Date(secondExpense.date).getTime() -
      new Date(firstExpense.date).getTime()
    );
  });

  return Response.json(expenses);
}
