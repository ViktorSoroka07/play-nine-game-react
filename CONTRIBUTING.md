# Contributing to Play Nine

This guide covers architecture patterns, development practices, and testing approach for this project.

## Tech Stack

- **React 19.0.0** — Latest with new JSX transform (no React import needed)
- **TypeScript 5.9** — Strict mode enabled, 100% type-safe codebase
- **Vite 6.4** — Lightning-fast build tool with React plugin
- **Vitest 3.2** — Modern test runner with jsdom environment
- **React Compiler** (experimental) — Auto-memoization & optimization via `babel-plugin-react-compiler`
- **ESLint + TypeScript ESLint** — React Hooks exhaustive-deps rule enforced

## State Management

The **Game** component uses `useReducer` with a discriminated-union action type:

```typescript
type GameAction =
  | { type: 'SELECT_NUMBER'; number: number }
  | { type: 'UNSELECT_NUMBER'; number: number }
  | { type: 'CHECK_ANSWER' }
  | { type: 'ACCEPT_ANSWER' }
  | { type: 'REDRAW' }
  | { type: 'RESET' };
```

**Key principle:** every transition is a named case inside the reducer. A
`Partial<GameState>` merge reducer is `setState` with extra ceremony - it
centralises nothing, and it lets any caller write any field. Naming the
transitions is the reason to reach for `useReducer` at all.

**Key principle:** Initial state is created via `getInitialState()` factory function, not a constant. This ensures `getRandom()` is called fresh on every reset, not evaluated once at module load.

```typescript
// ✓ Correct
const getInitialState = (): GameState => ({
  selectedNumbers: [],
  numberOfStars: getRandom(),  // called fresh each time
  // ...
});

// ✗ Wrong (getRandom called once at startup)
const initialState = { numberOfStars: getRandom(), ... };
```

All state transitions use `dispatch()`:

```typescript
// ✓ Always dispatch a named action
dispatch({ type: 'SELECT_NUMBER', number });

// ✗ Never dispatch a partial state bag
dispatch({ selectedNumbers: [...selectedNumbers, number], correct: null });

// ✗ Never useState for multi-field state
const [selectedNumbers, setSelectedNumbers] = useState([]);
const [correct, setCorrect] = useState(null);
```

### Answer state is a union, not a tri-state boolean

`boolean | null` for "correct?" forces a nested ternary at every read site and
makes `null` quietly mean "not asked yet". Name the three states instead:

```typescript
type AnswerStatus = 'unchecked' | 'correct' | 'wrong';
```

## Component Structure

**Folder pattern:**

```
src/components/<ComponentName>/
  <ComponentName>.tsx          # implementation
  <ComponentName>.test.tsx     # tests (100% coverage target)
  index.ts                     # named exports
```

**Exports:** Always use named exports, never default exports.

```typescript
// ✓ Correct: index.ts
export { Game } from './Game';

// ✗ Wrong
export { default } from './Game';
```

**Functional vs Class Components:**

- Functional components everywhere, except
- `ErrorBoundary` must be a class component (React requirement)

## React Best Practices

### No Derived State via useEffect

**Anti-pattern:** Computing state in `useEffect`

```typescript
// ✗ Wrong
useEffect(() => {
  const isDone = usedNumbers.length === 9;
  setDoneStatus(isDone ? 'Done' : null);
}, [usedNumbers]);
```

**Correct:** Prefer inline computed values in render; use `useMemo` only for expensive calculations or when identity stability is required

```typescript
// ✓ Also good (simple and clear)
const doneStatus =
  usedNumbers.length === 9 ? 'Done. Nice!' : redraws === 0 && !possibleSolutions() ? 'Game Over!' : null;

// ✓ Correct when memoization is truly needed
const doneStatus = useMemo((): string | null => {
  if (usedNumbers.length === 9) return 'Done. Nice!';
  if (redraws === 0 && !possibleSolutions()) return 'Game Over!';
  return null;
}, [usedNumbers, redraws, possibleSolutions]);
```

The key rule is to avoid `useEffect` for derived state. With React Compiler enabled, `useMemo` is optional in many places and should be reserved for meaningful wins.

### useCallback for Event Handlers

With React Compiler enabled, do not treat `useCallback` as mandatory. Prefer plain handlers first, then add `useCallback` only if:

- a dependency array needs stable identity semantics,
- you pass handlers into memoized/non-compiled boundaries,
- or profiling shows a real rerender regression.

Example when `useCallback` is justified:

```typescript
// ✓ Correct
const selectNumber = useCallback((clickedNumber: number) => {
  dispatch({ type: 'SELECT_NUMBER', number: clickedNumber });
}, []);
```

In short: keep the code simplest first, then memoize deliberately.

### Error Boundary

Wraps the entire app in `src/index.tsx` to catch runtime errors:

```typescript
root.render(
  <ErrorBoundary>
    <Game />
  </ErrorBoundary>
);
```

The ErrorBoundary shows a recovery UI with a "Try Again" button that resets the error state.

### Accessibility

- Use semantic `<button>` elements, never `<div onClick=...>`
- Add `aria-label` to all interactive elements
- Use `aria-pressed` for toggle buttons
- Use `aria-hidden="true"` for decorative icons

```typescript
<button
  className="btn btn-primary"
  onClick={handleClick}
  aria-label="Check answer"
>
  =
</button>
```

### Keys in Lists

Always use stable identifiers:

```typescript
// ✓ Correct: stable identifier
{selectedNumbers.map((number) => (
  <span key={number} onClick={() => unselect(number)}>
    {number}
  </span>
))}

// ✗ Wrong: array index
{selectedNumbers.map((number, index) => (
  <span key={index} onClick={() => unselect(number)}>
    {number}
  </span>
))}
```

## Utility Functions

All utilities are **pure functions**—no mutations, no side effects:

```typescript
// ✓ Correct: immutable
export const getRandom = (): number => Math.floor(Math.random() * 9) + 1;

export function possibleCombinationSum(arr: number[], n: number): boolean {
  // Uses arr.slice(0, -1), not arr.pop()
  if (arr[arr.length - 1] > n) {
    return possibleCombinationSum(arr.slice(0, -1), n);
  }
  // ...
}
```

## Testing

### Setup

Tests use Vitest with globals enabled (`describe`, `it`, `expect`, `vi` available without imports).

Setup file: `src/test/setup.ts` imports `@testing-library/jest-dom/vitest`.

### Patterns

Use `userEvent.setup()` for user interactions (not `fireEvent`):

```typescript
describe('Game', () => {
  it('allows selecting numbers', async () => {
    const user = userEvent.setup();
    const { container } = render(<Game />);

    await user.click(screen.getByText('5'));
    expect(screen.getByText('5')).toHaveClass('selected-true');
  });
});
```

Use `within()` for scoped queries:

```typescript
const numbersFrame = container.querySelector('#numbers-frame')!;
await user.click(within(numbersFrame).getByText('4'));
```

### Coverage Target

Aim for **100% statement + branch coverage** per component.

Current status:

- **Game**: 98.03% statements, 97.29% branches
- **AnswerFrame, ButtonFrame, DoneFrame, NumbersFrame, StarsFrame**: 100% statements
- **ErrorFallback**: 100% statements
- **Utilities**: 100%
- **Overall**: 93.19% statements, 85.71% branches (the remainder is `index.tsx`,
  the entry point, and the barrel `index.ts` files)

### Determinism

The board's draw comes from `getRandom`. Tests script it rather than play
against it:

```typescript
const spy = vi.spyOn(utils, 'getRandom');

spy.mockReturnValueOnce(3); // this turn is solved by 1 + 2
```

A test that retries until random values cooperate is not a test - it is a
probability, and it will fail in CI at exactly that rate.

## Adding a New Component

1. Create `src/components/<Name>/` folder
2. Create `<Name>.tsx` (functional component, proper TypeScript interface for props)
3. Create `<Name>.test.tsx` (comprehensive tests, 100% coverage target)
4. Create `index.ts` with `export { <Name> } from './<Name>'`
5. Export from `src/components/index.ts`

Example props interface:

```typescript
interface NumberFrameProps {
  usedNumbers: number[];
  selectedNumbers: number[];
  selectNumber: (number: number) => void;
}

export function NumbersFrame({ usedNumbers, selectedNumbers, selectNumber }: NumbersFrameProps) {
  // ...
}
```

## Linting & Types

**Commands:**

```bash
npm run lint          # ESLint (must pass with 0 errors)
npm run typecheck     # tsc --noEmit (must pass with 0 errors)
npm test              # Run tests in watch mode
npm run coverage      # Full coverage report
npm run build         # Production build (must succeed with 0 warnings)
```

ESLint does not type-check. `npm run typecheck` is a separate gate, and CI runs
both - see `.github/workflows/ci.yml`.

**Rules enforced:**

- TypeScript strict mode (no implicit any)
- React Hooks exhaustive-deps rule (caught by ESLint)
- No unused variables or imports (cleaned up by TypeScript)
- 0 ESLint errors/warnings in CI

## React Compiler

The experimental `babel-plugin-react-compiler` is **enabled** in `vite.config.ts`:

```typescript
react({
  babel: {
    plugins: [['babel-plugin-react-compiler']],
  },
});
```

This automatically memoizes components and optimizes renders without requiring `React.memo()` or extra dependencies. If issues arise, comment out the plugin.

## Code Review Checklist

- [ ] All `.tsx` files have proper `interface Props` and typed exports
- [ ] No `useEffect` used for derived state
- [ ] `useMemo`/`useCallback` added only for semantic needs or measured performance issues
- [ ] Components are functional (except ErrorBoundary)
- [ ] Buttons are semantic `<button>` elements with `aria-label`
- [ ] Keys use stable identifiers, not array indices
- [ ] Test file exists with 100% coverage target
- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm test` passes
- [ ] `npm run build` succeeds with 0 warnings
