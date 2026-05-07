````md
# AGENTS.md

# Project AI Development Guide

This file defines standards, architecture rules, and development practices for any AI agent or developer working in this project.

The goal is to maintain consistency, scalability, clean code, and production-quality results.

---

# Core Principles

- Always prioritize clean, maintainable, scalable code.
- Prefer readability over cleverness.
- Keep solutions simple unless complexity is necessary.
- Follow existing project patterns before introducing new ones.
- Avoid unnecessary rewrites.
- Respect current architecture.
- Think production-first.

---

# Tech Stack (edit for each project)

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Shadcn/UI (if installed)
- Prisma / PostgreSQL (if used)
- Zod
- React Hook Form
- Jest / Vitest / Playwright (depending on project)

---

# Project Structure Rules

## App Router

Use App Router structure only.

```txt
/app
/components
/lib
/hooks
/types
/constants
/services
/actions
/tests
````

## Route Conventions

* New pages must follow:

```txt
/app/module/page.tsx
/app/module/loading.tsx
/app/module/error.tsx
```

* Use nested layouts when needed.
* Keep routes organized by feature.

---

# Components Rules

## Reusability First

Before creating a new component:

1. Check if a reusable version already exists.
2. If a component can be generic, make it reusable.
3. Avoid duplicated UI patterns.

## Component Guidelines

* Components must have a single responsibility.
* Keep components small and composable.
* Extract repeated logic into hooks.
* Extract repeated UI into reusable components.
* Prefer composition over prop explosion.

## Naming

```txt
UserCard.tsx
ProductTable.tsx
CreateUserDialog.tsx
```

Use PascalCase for components.

---

# Server / Client Components

## Default Rule

Use Server Components by default.

## Use Client Components only when needed:

* useState
* useEffect
* browser APIs
* interactive UI
* event handlers

Use:

```tsx
"use client";
```

only when necessary.

---

# Constants Management

All reusable constants must be extracted.

Examples:

```txt
/constants/routes.ts
/constants/roles.ts
/constants/messages.ts
/constants/config.ts
```

Avoid hardcoded strings repeated across the project.

---

# Business Logic Rules

Never place complex logic directly inside UI components.

Use:

```txt
/lib
/services
/actions
/hooks
```

Examples:

* validation logic
* formatting
* calculations
* API calls
* permissions
* business rules

---

# API / Data Fetching Rules

Prefer in this order:

1. Server Actions
2. Route Handlers
3. Client fetching only when required

Use loading states and error handling always.

---

# Forms Rules

Use:

* React Hook Form
* Zod validation

Validation must exist for every user input.

Both frontend and backend validation when applicable.

---

# TypeScript Rules

Always use strict typing.

Avoid:

```ts
any
```

Prefer:

```ts
type
interface
generics
unions
```

Create shared types inside:

```txt
/types
```

---

# Styling Rules

Use Tailwind utility-first approach.

Keep UI consistent:

* spacing system
* typography hierarchy
* responsive design
* accessible contrast
* hover/focus states

Avoid random styles.

Reuse design tokens when available.

---

# Comments Rules

All comments must be written in English.

Good:

```ts
// Validate user permissions before saving
```

Bad:

```ts
// validar usuario
```

Only comment when useful.

Do not explain obvious code.

Prefer self-documenting code first.

---

# Testing Rules

Every new feature or function must include corresponding tests.

## Minimum expectation:

* Unit tests for utilities/functions
* Component tests when logic exists
* Integration tests for flows when needed

Examples:

```txt
/tests
__tests__
component.test.tsx
utils.test.ts
```

## Required cases:

* success case
* error case
* edge cases

Never add important logic without tests.

---

# Performance Rules

* Avoid unnecessary re-renders
* Use memoization only when justified
* Lazy load heavy components
* Optimize images with Next/Image
* Prefer server rendering when possible
* Minimize client bundle size

---

# Accessibility Rules

Always consider accessibility:

* semantic HTML
* labels on inputs
* keyboard navigation
* aria attributes when needed
* focus states
* alt text on images

---

# Security Rules

* Validate all inputs
* Sanitize unsafe content
* Never expose secrets
* Use environment variables
* Check auth/permissions on server side
* Never trust client input

---

# Error Handling Rules

Always handle:

* empty states
* loading states
* network failures
* invalid inputs
* unauthorized access

Use user-friendly messages.

Log technical errors when needed.

---

# Code Review Checklist

Before finishing any task, verify:

* Is code reusable?
* Is there duplicated logic?
* Are constants extracted?
* Are comments in English?
* Are tests included?
* Is typing correct?
* Is responsive UI preserved?
* Is accessibility respected?
* Is performance acceptable?
* Does it match current architecture?

---

# AI Agent Behavior Rules

When working in this project:

* Read surrounding files before editing.
* Respect naming conventions.
* Reuse existing utilities/components first.
* Do not introduce new libraries unless necessary.
* Do not refactor unrelated code.
* Keep changes focused.
* If multiple solutions exist, choose the simplest scalable one.
* Preserve backwards compatibility when possible.

---

# Output Expectations

All generated code must be:

* Production-ready
* Typed
* Clean
* Reusable
* Tested
* Readable
* Consistent with existing codebase

---

# If Unsure

If project patterns already exist, follow them.

Consistency > Personal preference.

---

# Current Project Context (edit manually)

Project Name:
Main Goal:
Primary Users:
Critical Modules:
Known Constraints:

---

```
```
````md id="cont2ag"
# Recommended Extra Rules (Optional but Strongly Suggested)

## Imports Rules

Order imports consistently:

1. React / Next
2. External libraries
3. Internal aliases (@/)
4. Relative imports
5. Types imports

Example:

```ts
import { Suspense } from "react";
import Link from "next/link";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

import { formatDate } from "../utils/formatDate";
import type { User } from "../types";
````

Remove unused imports always.

---

## File Naming Rules

Use consistent naming:

* Components: PascalCase.tsx
* Hooks: useSomething.ts
* Utilities: camelCase.ts
* Constants: UPPER_CASE groups or camelCase exports
* Tests: *.test.ts / *.test.tsx

Examples:

```txt
components/UserCard.tsx
hooks/useAuth.ts
lib/formatCurrency.ts
constants/routes.ts
```

---

## Hooks Rules

Use custom hooks when stateful logic is repeated.

Examples:

```txt
/usePagination.ts
/useDebounce.ts
/usePermissions.ts
```

Do not create hooks unnecessarily.

---

## State Management Rules

Prefer local state first.

Use shared/global state only when necessary.

Priority:

1. Server state
2. Component state
3. Context
4. External state libraries

Avoid overengineering.

---

## Environment Variables Rules

All secrets must live in:

```txt
.env.local
.env.production
```

Use safe prefixes:

```txt
NEXT_PUBLIC_
```

only for values intended for browser exposure.

Never hardcode keys.

---

## Logging Rules

Use logs intentionally.

Good:

```ts
logger.error("Failed to create appointment", error);
```

Avoid random console.log in production code.

Remove debug logs before merge.

---

## Database Rules (If Applicable)

* Use migrations properly
* Add indexes when needed
* Avoid N+1 queries
* Select only required fields
* Validate inputs before writes
* Use transactions for multi-step writes

---

## Git Rules

Branch naming examples:

```txt
feature/calendar-sync
fix/login-error
refactor/user-table
test/notifications
```

Commits:

```txt
feat: add appointment calendar sync
fix: handle invalid token refresh
refactor: extract reusable modal
test: add unit tests for pricing utils
```

---

## Pull Request Rules

Every PR should include:

* What changed
* Why it changed
* Screenshots if UI changed
* Test coverage notes
* Risks / migrations if any

---

## Documentation Rules

When adding important modules, update docs.

Examples:

```txt
/docs/auth.md
/docs/api.md
/docs/deployment.md
/docs/architecture.md
```

If architecture changes, documentation must change too.

---

## Internationalization Rules (If Applicable)

Never hardcode user-facing text in many places.

Use:

```txt
/messages/en.ts
/messages/es.ts
```

Prepare for translation early.

---

## SEO Rules (If Public Website)

Use:

* metadata titles
* descriptions
* semantic headings
* Open Graph tags
* clean URLs

Use Next metadata APIs.

---

## Analytics Rules

Track only meaningful events:

* signup
* purchase
* booking created
* form submitted

Do not spam analytics.

---

## UI/UX Rules

Prefer:

* clear hierarchy
* strong CTA buttons
* loading feedback
* empty states
* confirmation on destructive actions
* smooth transitions

Reduce friction.

---

## Mobile Rules

Every page must be usable on mobile first.

Check:

* touch targets
* responsive tables
* readable font sizes
* spacing
* menus/navigation

---

## Refactor Rules

Refactor only when it improves:

* readability
* reuse
* performance
* maintainability

Do not refactor stable code without reason.

---

## AI Task Workflow

Before coding:

1. Read nearby files
2. Understand feature patterns
3. Identify reusable parts
4. Plan smallest clean solution

During coding:

1. Keep scope focused
2. Reuse existing utilities
3. Maintain typing
4. Add tests

After coding:

1. Run lint
2. Run tests
3. Review edge cases
4. Check responsiveness
5. Verify imports
6. Remove dead code

---

## Forbidden Behaviors

Do NOT:

* Duplicate components unnecessarily
* Add dependencies casually
* Use any without reason
* Break existing APIs
* Ignore tests
* Hardcode repeated values
* Mix business logic in UI
* Leave TODOs without context
* Ship debug code

---

## Preferred Mindset

Build like the codebase will grow 10x.

Every file should help future developers move faster.

---

# Example Project Overrides (Fill Per Project)

## Example SaaS

Main Goal:
Manage bookings for local businesses

Critical Modules:

* auth
* calendar
* billing
* dashboard

## Example Ecommerce

Critical Modules:

* products
* cart
* checkout
* orders
* admin

## Example Internal Tool

Critical Modules:

* users
* reports
* permissions
* exports

---

# Final Rule

When in doubt:

Choose the cleanest, simplest, reusable solution aligned with current project conventions.

```
```
