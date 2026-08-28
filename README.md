# Play Nine

[![CI](https://github.com/ViktorSoroka07/play-nine-game-react/actions/workflows/ci.yml/badge.svg)](https://github.com/ViktorSoroka07/play-nine-game-react/actions/workflows/ci.yml)

A browser-based number puzzle game built with React and TypeScript.

## How to play

The board draws a number of stars. Pick the numbers from 1-9 that add up to
that count, then check the answer. Accept a correct answer and those numbers
are used up for the rest of the game; a fresh draw follows.

You get five redraws. The game ends when you have used all nine numbers
("Done. Nice!"), or when your redraws are gone and no combination of the
numbers still on the board can reach the current draw ("Game Over!").

## Setup

Run `npm install`.

## Commands

- `npm start` - run the development server
- `npm test` - run tests in watch mode
- `npm run coverage` - run tests with coverage report
- `npm run lint` - run ESLint checks
- `npm run typecheck` - type-check without emitting
- `npm run build` - build for production

## Stack

- React 19
- TypeScript
- Vite
- Vitest + Testing Library
