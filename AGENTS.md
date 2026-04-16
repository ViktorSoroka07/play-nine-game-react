# Agent Instructions — Play Nine (React)

Production-ready card game built with **React 19**, **TypeScript**, **Vite**, **Vitest**.

## Commands

```bash
npm install              # install dependencies
npm run dev              # dev server at http://localhost:8080
npm test                 # vitest in watch mode
npm run coverage         # coverage report (93.45% statements)
npm run build            # production build (~62KB gzip)
npm run lint             # ESLint + TypeScript check
docker-compose up        # containerised dev (port 8080)
```

## Project Layout

```
src/
  index.tsx              # app entry point
  components/            # 6 components, each with .tsx, .test.tsx, index.ts
    Game/                # root component, useReducer state management
    ErrorBoundary/       # error recovery
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

vite.config.ts           # React compiler enabled
tsconfig.json            # strict mode
eslint.config.js         # React Hooks rules enforced
```

## Key Patterns

**State Management**

- Use `useReducer` for multi-field state: `dispatch({ field: value })`
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

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed architecture patterns.
