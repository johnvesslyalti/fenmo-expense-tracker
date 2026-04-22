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

- Live app: `Add deployed URL here`
- Repository: `Add repository URL here`
