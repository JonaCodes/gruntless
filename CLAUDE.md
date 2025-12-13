# Gruntless Project Conventions

## Architecture

### Backend Flow

Routes → Controllers → Services

- **Routes**: Handle HTTP requests/responses only. Minimal logic.
- **Controllers**: Parse input, call services, return responses. Keep lean.
- **Services**: All business logic lives here. Single responsibility per
  service.

### Code Organization

- Use `shared/` for code reused across server and public
- Keep files small and focused
- One responsibility per file
- Extract constants to avoid magic strings/numbers

## Key Principles

### DRY (Don't Repeat Yourself)

- Extract common logic into utilities or services
- Reuse shared components and functions

### Single Responsibility

- Each file should have one clear purpose
- Each function should do one thing well

### No Magic Values

- All hardcoded strings and numbers must be constants
- Define constants at the top of files or in dedicated constant files

### Keep Files Small

- Avoid bloated files
- Split large files into focused modules

## Tech Stack

- **Backend**: Express.js, TypeScript, Sequelize ORM
- **Frontend**: React, Vite
- **Database**: PostgreSQL (via Sequelize), Supabase in prod
- **Package Manager**: pnpm (monorepo)

## Important notes

- Never run `pnpm run dev` or migrations, don't start the server, or client - I
  will do these myself manually
