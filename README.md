<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.svg">
  <img alt="Play Nine: the same puzzle in React 0.14 in 2016 and React 19 in 2026" src="assets/banner-light.svg">
</picture>

# Play Nine

[![CI](https://github.com/ViktorSoroka07/play-nine-game-react/actions/workflows/ci.yml/badge.svg)](https://github.com/ViktorSoroka07/play-nine-game-react/actions/workflows/ci.yml)

This is not a product. It is where I learn React.

I wrote the first version by hand in April 2016 to teach myself React 0.14, and
I have rebuilt it in this same repository whenever the ecosystem moved far
enough to be worth relearning. The puzzle is beside the point. What the
repository holds is ten years of the same small feature, written by the same
person, while React changed underneath it.

## Ten years in one repository

|         | April 2016                         | August 2026                                      |
| ------- | ---------------------------------- | ------------------------------------------------ |
| React   | 0.14.8, `React.createClass`        | 19, function components                          |
| State   | `getInitialState`, `this.setState` | `useReducer` with named actions                  |
| Modules | `var React = require('react')`     | ES modules                                       |
| Build   | browserify, babelify, watchify     | Vite                                             |
| Types   | none                               | TypeScript, `strict`, `noUncheckedIndexedAccess` |
| Tests   | none                               | 30, deterministic, run in CI                     |

`React.createClass` was deprecated in React 15.5 and removed in 16. The early
commits here come from before hooks, before browsers ran ES modules, and from a
time when TypeScript was not yet a normal choice for a React app.

## What the agent got right, and what it missed

I wrote the 2016 version by hand. The 2026 rebuild I did with an AI coding
agent: over three days in April it moved the project to Vite, React 19,
TypeScript and Vitest, wrote a test suite, and split the documentation. That was
real work, and by hand it would have taken me far longer.

I read it properly four months later. Four things had survived the rebuild.

`possibleCombinationSum` is 32 lines of subset-sum search with its own passing
unit tests, and the game never called it. Game over fired as soon as the redraws
ran out, so the game gave up while the board was still winnable.

One test failed about half the time. It read the target star count once, outside
its retry loop, then redrew, and every redraw picks a new target. Its greedy
`1+2+3` selection can only reach 4 of the 9 possible targets, so an unreachable
first draw spent all five redraws, ended the game, and left the test clicking a
button that was no longer on screen. It failed 2 of 5 runs when I measured it.

Another test spied on `possibleCombinationSum` and forced its return value.
Since the app never called it, the spy did nothing and the test passed for the
wrong reason.

`AGENTS.md` said `npm run lint` also type-checked. It only ran ESLint, and three
type errors had been sitting in the code untouched. A leftover `vite.config.js`
was shadowing the `vite.config.ts` that turns React Compiler on, so the compiler
never ran.

The migration was worth doing and I would do it again. What it needed was
someone to read the result: all four of those defects had a green test suite
sitting on top of them. The fixes are in
[`e53614a`](https://github.com/ViktorSoroka07/play-nine-game-react/commit/e53614a),
and the tests now script the random draw instead of playing against it, which is
what made them deterministic.

## Run it

```sh
npm install
npm start          # dev server on http://localhost:8080
```

| Command             | What it does                 |
| ------------------- | ---------------------------- |
| `npm test`          | Vitest in watch mode         |
| `npm run coverage`  | tests with a coverage report |
| `npm run lint`      | ESLint                       |
| `npm run typecheck` | `tsc --noEmit`               |
| `npm run build`     | production build             |

CI runs lint, typecheck, coverage and build on pushes to `master` and on
pull requests.

## How to play

The board draws a number of stars. Pick the numbers from 1 to 9 that add up to
that count, then check the answer. Accept a correct answer and those numbers are
used up for the rest of the game, and a fresh draw follows.

You get five redraws. The game ends when you have used all nine numbers, or when
your redraws are gone and no combination of the numbers still on the board can
reach the current draw.

## License

MIT. See [LICENSE](LICENSE).
