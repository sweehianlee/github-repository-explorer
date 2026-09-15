# GitHub Repository Explorer

A small Vue 3 application for searching GitHub repositories and viewing repository details using the GitHub REST API.

## Features

- Search public GitHub repositories
- Sort results by best match, stars, forks, help wanted issues, or recently updated
- Paginated search results
- Clear the current search and reset results
- Repository detail view
- URL-based search, sorting, and pagination state
- Loading, empty, error, rate-limit, and not-found states
- Responsive layout
- Retry support for failed requests

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Naive UI
- SCSS
- Vitest
- Vue Test Utils
- ESLint

## Getting Started

Requires Node.js 20 or later.

```bash
pnpm install
pnpm dev
```

## Quality Checks

Run the unit tests:

```bash
pnpm test:run
```

Run ESLint:

```bash
pnpm lint
```

Run the production build and TypeScript checks:

```bash
pnpm build
```

## GitHub API

The application uses the public GitHub REST API without authentication.

No GitHub personal access token is included in the client application. This avoids exposing credentials in the browser. GitHub's unauthenticated API rate limits therefore apply, and the application handles rate-limit errors in the UI.

## Testing

Unit tests focus on behavior that is most important to the user experience, including:

- API error handling
- Network failures
- Nullable repository data
- Search state
- Sorting parameters
- Repository card rendering

## AI Assistance

AI tools were used during implementation for brainstorming, code suggestions, debugging, and review. All generated suggestions were manually reviewed and adapted.


## Live Demo

Deployed on Vercel: https://github-repository-explorer-gamma.vercel.app/