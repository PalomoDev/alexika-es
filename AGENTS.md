# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains all Next.js route handlers; pay attention to segment folders like `app/(root)/products` that mirror the public URL structure.
- `components/` holds reusable UI with `shared/` for cross-domain widgets and `layouts/` for page scaffolding.
- `lib/` groups server logic: `lib/actions/` for server actions, `lib/validations/` for Zod schemas, and `lib/utils/` for shared helpers.
- `db/` and `prisma/` store seed data and the Prisma schema; update both when the data model changes.
- `public/` serves static assets, while `stores/` and `hooks/` contain client state and React hooks.

## Build, Test, and Development Commands
- `npm run dev` starts the Turbopack dev server at `http://localhost:3000`.
- `npm run build` builds the production bundle; run it before container builds or deploys.
- `npm run start` serves the compiled app locally for smoke tests.
- `npm run lint` runs `next lint` with the repository ESLint config.
- `npm run test` (or `npm run test:run`) executes the Vitest suite; `npm run test:ui` opens the Vitest UI for focused runs.

## Coding Style & Naming Conventions
- Use TypeScript strictly. Prefer explicit types for public functions and server actions.
- Follow the existing four-space indentation and single quotes in TS/TSX files, except where JSX attributes require double quotes.
- Co-locate feature-specific helpers with their route or component to keep imports shallow; default-export pages, named-export everything else.
- Run `npm run lint` prior to commits; address ESLint autofix suggestions instead of disabling rules.

## Testing Guidelines
- Write unit tests with Vitest plus `jsdom` for component behavior; place specs next to source files using the `*.test.ts(x)` pattern.
- Mock Prisma and network calls via dependency injection or module mocks to keep tests hermetic.
- Strive for coverage on business logic in `lib/actions` and validation schemas; document any intentional gaps in the PR description.

## Commit & Pull Request Guidelines
- Mirror the existing concise, lowercase commit style (e.g., `add product page`, `work with cart and order`). Group related changes per commit.
- Each PR should include: a clear summary, linked issue (if any), screenshots for UI changes, and notes on testing performed.
- Rebase onto the latest `main` before requesting review; resolve merge conflicts locally and re-run lint/tests afterwards.

## Security & Configuration Tips
- Load secrets through `.env.local`; never commit environment files. Update `next.config.ts` when exposing runtime config.
- Prisma migrations must run with the correct database URL. Document any schema changes in `DEPLOY_TODO.md` for the ops team.
