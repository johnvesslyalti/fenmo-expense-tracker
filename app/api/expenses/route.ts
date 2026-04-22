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

  const expense = expenseStore.create(body, request.headers.get("Idempotency-Key") ?? undefined);

  return Response.json(expense, { status: 201 });
}
