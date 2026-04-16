# Agent Instructions — Play Nine (React)

A production-ready browser-based implementation of the "Play Nine" card game built with **React 19**, **TypeScript**, **Vite**, and **Vitest**.

## Quick Start

```bash
npm install              # install dependencies
npm run dev              # dev server at http://localhost:8080
npm test                 # vitest in watch mode
npm run coverage         # single run with v8 coverage (93.45% statements)
npm run build            # production build (~62KB gzip)
npm run lint             # ESLint + TypeScript check (0 errors/warnings)
docker-compose up        # containerised dev (same port 8080)
```

## Tech Stack

- **React 19.0.0** — Latest with new JSX transform (no React import needed)
- **TypeScript 5.9** — Strict mode enabled, 100% type-safe codebase
- **Vite 6.4** — Lightning-fast build tool with React plugin
- **Vitest 3.2** — Modern test runner with jsdom environment
- **React Compiler** (experimental) — Auto-memoization & optimization via `babel-plugin-react-compiler`
- **ESLint + TypeScript ESLint** — React Hooks exhaustive-deps rule enforced

## Project Layout

```
src/
  index.tsx              # app entry point (mounts Game in ErrorBoundary)
  components/
    ErrorBoundary/       # error recovery component (catches runtime errors)
    Game/                # root component, owns all state via useReducer
    StarsFrame/          # displays random 1–9 star count to match
    NumbersFrame/        # 1–9 clickable number grid
    AnswerFrame/         # currently selected numbers
    ButtonFrame/         # check / accept / redraw controls
    DoneFrame/           # win/lose end screen
  utils/
    getRandom.ts         # pure function: returns random 1–9
    possibleCombinationSum.ts  # checks if valid solution exists (immutable)
  test/
    setup.ts             # vitest setup (imports @testing-library/jest-dom)

vite.config.ts           # Vite + Vitest config (imports from vitest/config)
tsconfig.json            # TypeScript strict mode + vitest/globals types
eslint.config.js         # Flat config, typescript-eslint, React plugin
```

## Architecture & Best Practices

### State Management

- **Game** component uses `useReducer` with simple merge reducer: `(state, newState) => ({ ...state, ...newState })`
- Initial state created via `getInitialState()` factory function (ensures fresh `getRandom()` on reset, not stale initializer)
- All state transitions via `dispatch()`; avoid `useState` for multi-field state

### Component Structure

- **Folder pattern**: `src/components/<ComponentName>/`
  - `<ComponentName>.tsx` — component implementation
  - `<ComponentName>.test.tsx` — Vitest + Testing Library tests (100% coverage target)
  - `index.ts` — named exports only (`export * from './<ComponentName>'`)
- **No default exports** — named exports enforce clarity and consistency
- **Functional components only** — except ErrorBoundary (required to be class-based)

### React Best Practices

- **No derived state via useEffect** — computed values use `useMemo` with correct dependencies
- **useCallback for handlers** — all event handlers wrapped in `useCallback` before passing to child components
- **Error boundary** — wraps Game to catch runtime errors and show recovery UI
- **Accessibility** — proper `<button>` elements, `aria-labels`, `aria-pressed`, `aria-hidden` attributes
- **Keys** — use stable identifiers (`key={number}`), never `key={index}`

### Utility Functions

- **Pure functions** — no mutations, predictable outputs
- `getRandom()` returns `number` (1–9)
- `possibleCombinationSum(numbers: number[], sum: number): boolean` uses immutable `.slice()`, not `.pop()`

### Testing

- **Vitest globals** enabled: `describe`, `it`, `expect`, `vi` available without imports
- **Setup file** at `src/test/setup.ts` (imported by vite.config.ts)
- **Test patterns**: use `userEvent.setup()` for interactions, `within()` for scoped queries
- **Coverage**: 93.45% statements, 87.93% branches (validated via `npm run coverage`)

### Linting & Types

- **0 ESLint errors/warnings** — enforced via CI
- **React Hooks ESLint rule** — exhaustive-deps rule catches missing dependencies
- **TypeScript strict mode** — no implicit any, full type safety
- **vite.config.ts typed** — imports `defineConfig` from `vitest/config` for proper Vitest type inference

## Common Patterns

### Adding a New Component

1. Create `src/components/<Name>/` folder
2. Create `<Name>.tsx` (functional component, named export)
3. Create `<Name>.test.tsx` (test suite with 100% coverage target)
4. Create `index.ts` with `export * from './<Name>'`
5. Add to `src/components/index.js` if needed for re-export

### Updating State

```typescript
// ✓ Correct: use dispatch with merge reducer
dispatch({ selectedNumbers: [...selectedNumbers, num] });

// ✗ Avoid: useState for multi-field state
const [field1, setField1] = useState(...);
const [field2, setField2] = useState(...);
```

### Computed Values

```typescript
// ✓ Correct: use useMemo with dependencies
const doneStatus = useMemo(() => {
  if (availableNumbers.length === 0) return 'done';
  if (!possibleCombinationSum(availableNumbers, stars)) return 'lost';
  return null;
}, [availableNumbers, stars]);

// ✗ Avoid: derive state via useEffect
useEffect(() => setDoneStatus(...), []);
```

## Debugging & Validation

**Type check:** `npm run lint` (includes TypeScript errors)
**Run tests:** `npm test` (watch mode) or `npm run coverage` (single run)
**Build verification:** `npm run build` (should succeed with 0 warnings)

## React Compiler

The experimental `babel-plugin-react-compiler` is **enabled** in `vite.config.ts`. This automatically memoizes components and optimizes renders without extra code. If issues arise, disable by commenting out the babel plugin configuration.
