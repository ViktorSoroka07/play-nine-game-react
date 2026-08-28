# Agent Instructions — Play Nine (React)

Production-ready card game built with **React 19**, **TypeScript**, **Vite**, **Vitest**.

## Commands

```bash
npm install              # install dependencies
npm run dev              # dev server at http://localhost:8080
npm test                 # vitest in watch mode
npm run coverage         # coverage report (93.19% statements)
npm run build            # production build (~64KB gzip)
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit (must be 0 errors)
docker-compose up        # containerised dev (port 8080)
```

## Project Layout

```
src/
  index.tsx              # app entry point
  constants.ts           # board size and starting redraws
  components/            # 7 components, each with .tsx, .test.tsx, index.ts
    Game/                # root component, useReducer state management
    ErrorFallback/       # render-time error UI for react-error-boundary
    StarsFrame/          # displays random 1–9
    NumbersFrame/        # 1–9 clickable grid
    AnswerFrame/         # selected numbers
    ButtonFrame/         # check/accept/redraw controls
    DoneFrame/           # win/lose screen
  utils/                 # pure functions, 100% coverage
    getRandom.ts
    possibleCombinationSum.ts
  test/
    setup.ts             # vitest setup

vite.config.ts           # the only Vite config; React Compiler enabled
tsconfig.json            # strict + noUncheckedIndexedAccess
eslint.config.js         # React Hooks rules enforced
.github/workflows/ci.yml # lint, typecheck, coverage, build
```

## Key Patterns

**State Management**

- `useReducer` with a discriminated-union action: `dispatch({ type: 'SELECT_NUMBER', number })`
- Every transition is a named case in the reducer; components never merge partial state
- Factory function: `getInitialState()` ensures fresh `getRandom()` on reset

**Components**

- Functional only (except ErrorBoundary class component)
- Named exports, no defaults
- With React Compiler enabled, prefer plain handlers first; add `useCallback` only for semantic needs or measured regressions

**Computed Values**

- Never derive state via `useEffect`; prefer inline computation, and use `useMemo` only when there is a real need

**Tests**

- Target 100% coverage per component
- Use `userEvent.setup()` + `within()` for interactions
- **Never assert against real randomness.** Script the draw with
  `vi.spyOn(utils, 'getRandom')` - a test that retries until the dice cooperate
  is a hidden probability, not a test

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed architecture patterns.
