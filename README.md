# Flux | The Spatial Operating System

Flux is an enterprise-grade polymorphic workspace that unifies Ideation, Execution, and Scheduling.

## Features

- **Polymorphic Canvas**: Draw, write, and organize thoughts spatially.
- **AI Operator (Gen 9)**: Intelligent summarization and project planning.
- **Execution Engine**: Kanban and Table views synced with your canvas.
- **Enterprise Ready (Gen 10)**: SSO-ready authentication and plugin architecture.

## Getting Started

1.  **Clone the repository**
2.  **Install dependencies**: `npm install`
3.  **Setup Environment**: Copy `.env.example` to `.env` and fill in secrets.
4.  **Run Development Server**: `npm run dev`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite (Dev) / Postgres (Prod) with Prisma
- **Auth**: NextAuth v5 (Google, Apple)
- **UI**: TailwindCSS v4, Framer Motion, Radix UI
