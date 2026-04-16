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

The **Game** component uses `useReducer` with a simple merge reducer:

```typescript
const reducer = (state: GameState, newState: Partial<GameState>): GameState => ({
  ...state,
  ...newState,
});
```

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
// ✓ Always dispatch
dispatch({ selectedNumbers: [...selectedNumbers, num], correct: null });

// ✗ Never useState for multi-field state
const [selectedNumbers, setSelectedNumbers] = useState([]);
const [correct, setCorrect] = useState(null);
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

**Correct:** Use `useMemo` with explicit dependencies

```typescript
// ✓ Correct
const doneStatus = useMemo((): string | null => {
  if (usedNumbers.length === 9) return 'Done. Nice!';
  if (redraws === 0 && !possibleSolutions()) return 'Game Over!';
  return null;
}, [usedNumbers, redraws, possibleSolutions]);
```

The difference: `useMemo` computes on every render but memoizes the result; `useEffect` runs after render. Using `useEffect` here causes timing issues and stale closures.

### useCallback for Event Handlers

All event handlers passed to child components must be wrapped in `useCallback` to maintain referential stability:

```typescript
// ✓ Correct
const selectNumber = useCallback(
  (clickedNumber: number) => {
    if (state.selectedNumbers.indexOf(clickedNumber) < 0) {
      dispatch({
        selectedNumbers: state.selectedNumbers.concat(clickedNumber),
        correct: null,
      });
    }
  },
  [state.selectedNumbers]
);
```

This prevents unnecessary re-renders in child components and allows them to be memoized by the React Compiler.

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

- **Game**: 88.39% (complex game logic, some branches hard to test)
- **AnswerFrame, ButtonFrame, DoneFrame, NumbersFrame, StarsFrame**: 100%
- **ErrorBoundary**: 96%
- **Utilities**: 100%
- **Overall**: 93.45% statements, 87.93% branches

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
npm run lint          # ESLint + TypeScript check (must pass with 0 errors)
npm test              # Run tests in watch mode
npm run coverage      # Full coverage report
npm run build         # Production build (must succeed with 0 warnings)
```

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
- [ ] No `useEffect` used for derived state (use `useMemo`)
- [ ] All event handlers passed to children use `useCallback`
- [ ] Components are functional (except ErrorBoundary)
- [ ] Buttons are semantic `<button>` elements with `aria-label`
- [ ] Keys use stable identifiers, not array indices
- [ ] Test file exists with 100% coverage target
- [ ] `npm run lint` passes (0 errors)
- [ ] `npm test` passes
- [ ] `npm run build` succeeds with 0 warnings
