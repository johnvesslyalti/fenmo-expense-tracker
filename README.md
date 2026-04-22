# Expense Tracker

## Overview

This project is a minimal full-stack expense tracker built as a take-home assignment. It allows users to create and review personal expenses, filter them by category, view the current total for visible expenses, and inspect entries sorted newest first.

The application is designed around a small but production-minded API surface. It includes idempotent expense creation to better handle retries, duplicate submits, and slow network conditions. For simplicity and speed of delivery, the project uses an in-memory store, which is suitable for this exercise but not durable across server restarts or redeploys.

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- React
- Tailwind CSS
- In-memory data store
- Bruno collection for API testing

## Features

- Create a new expense with:
  - amount
  - category
  - description
  - date
- View a list of all expenses
- Filter expenses by category
- Sort expenses by date in descending order
- Display the total for the currently visible expenses
- Validate expense input on the backend
- Handle duplicate create requests with idempotency keys
- Simulate slow API responses to test loading and retry behavior

## Idempotency

The `POST /api/expenses` endpoint supports idempotent creation through the `Idempotency-Key` request header.

On the backend, idempotency keys are stored in memory alongside:

- the previously created expense
- a serialized representation of the original request payload

This allows the API to handle retries and duplicate submissions safely:

- If the same `Idempotency-Key` is reused with the same payload, the API returns the existing expense instead of creating a duplicate record.
- If the same `Idempotency-Key` is reused with a different payload, the API returns a `409 Conflict` response.

This behavior is especially useful for real-world conditions such as slow networks, repeated button clicks, or client-side retries after a timeout. In this implementation, the idempotency store is intentionally in-memory to keep the assignment lightweight, which means the protection only lasts for the lifetime of the running server process.

## Design Decisions and Trade-offs

This project uses an in-memory store for both expense data and idempotency tracking. That choice was made deliberately to keep the implementation small, fast to build, and easy to review within the scope of the assignment. It allowed the work to focus on API behavior, validation, idempotent request handling, and frontend interaction without adding database setup or operational complexity.

This approach does have important limitations. Because the app is deployed on Vercel in a serverless environment, in-memory state is not durable across cold starts, redeploys, or multiple instances. In practice, that means both expense data and idempotency keys only exist for the lifetime of a single running instance. The behavior is sufficient for demonstrating the assignment requirements, but it should not be treated as production-grade persistence.

Because the app is deployed on Vercel (serverless), both data and idempotency guarantees are limited to a single instance and are not durable across cold starts or multiple concurrent instances.

In a production system, this would be replaced with persistent infrastructure. A relational database such as PostgreSQL would be a strong choice for storing expenses durably, and idempotency records could be stored either in PostgreSQL or in a dedicated fast store such as Redis. That would make the system resilient across restarts and horizontally scaled instances while preserving the same idempotent API contract.

## API Endpoints

### `POST /api/expenses`

Creates a new expense entry.

**Headers**

- `Content-Type: application/json`
- `Idempotency-Key: <unique-key>`

**Request body**

```json
{
  "amount": 24.5,
  "category": "food",
  "description": "Lunch bowl",
  "date": "2026-04-22"
}
```

**Behavior**

- Validates the request body before creating an expense
- Converts the submitted amount into integer cents internally for safer money handling
- Stores expenses in memory
- Uses the `Idempotency-Key` header to prevent duplicate expense creation

**Idempotency behavior**

- Same key + same payload: returns the previously created expense
- Same key + different payload: returns `409 Conflict`

**Response codes**

- `201 Created`: expense created successfully
- `400 Bad Request`: invalid JSON or failed validation
- `409 Conflict`: idempotency key reused with a different payload
- `500 Internal Server Error`: unexpected server failure

### `GET /api/expenses`

Returns the current list of expenses.

**Query parameters**

- `category`: filters expenses by category

Example:

```text
/api/expenses?category=food
```

**Behavior**

- Returns expenses from the in-memory store
- Sorts expenses by date in descending order by default
- Supports category-based filtering

**Response codes**

- `200 OK`: expenses returned successfully

## Project Structure

- `/app`
  Contains the Next.js App Router pages and API route handlers, including the main UI page and the `/api/expenses` backend route.
- `/components`
  Contains reusable React components such as the expense form and expense list.
- `/lib`
  Contains supporting application logic, including the in-memory expense store and idempotency handling.

## Setup Instructions

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run type checking

```bash
npx tsc --noEmit
```

### API testing

Bruno request files for the API are available in the local Bruno collection directory used during development.

## Live Demo

- Live app: `https://johnvesslyalti-fenmo-expense-tracker.vercel.app`
- Repository: `https://github.com/johnvesslyalti/fenmo-expense-tracker`

## Future Improvements

- Replace the in-memory store with PostgreSQL for durable expense persistence across deployments and restarts.
- Move idempotency tracking into Redis or a durable database-backed table to support multi-instance serverless execution more reliably.
- Add pagination, search, and richer filtering to better handle larger datasets.
- Introduce authentication and user-scoped expense data for multi-user support.
- Improve frontend UX with optimistic updates, toasts, better empty states, and more polished error and retry flows.
