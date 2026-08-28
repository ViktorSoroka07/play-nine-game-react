import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, vi } from 'vitest';

import { Game } from './Game';
import * as utils from '../../utils';
import {
  getNumberButton,
  getAllNumberButtons,
  getUnselectButton,
  getAllUnselectButtons,
  getCheckAnswerButton,
  getAcceptAnswerButton,
  getRedrawButton,
  getStarsCount,
} from '../../test/selectors';

// The board draws its star count from `getRandom`. Scripting that draw is what
// makes these tests deterministic - asserting against real randomness means
// asserting against a probability.
const drawStars = (...counts: number[]) => {
  const spy = vi.spyOn(utils, 'getRandom');

  counts.forEach((count) => spy.mockReturnValueOnce(count));

  // Any draw past the scripted ones repeats the last, so a test never falls
  // back to real randomness.
  return spy.mockReturnValue(counts[counts.length - 1] ?? 1);
};

const getRedrawsLeft = () => parseInt(getRedrawButton().textContent?.match(/\d+/)?.[0] ?? '0', 10);

describe('Game', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with initial state', () => {
    drawStars(6);

    render(<Game />);

    expect(screen.getByRole('heading', { name: 'Play Nine' })).toBeInTheDocument();
    expect(getAllNumberButtons()).toHaveLength(9);
    expect(getStarsCount()).toBe(6);
    expect(getAllUnselectButtons()).toHaveLength(0);
  });

  it('allows selecting and unselecting numbers', async () => {
    const user = userEvent.setup();

    drawStars(6);
    render(<Game />);

    await user.click(getNumberButton(4));
    expect(getUnselectButton(4)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unselect 4' }));
    expect(getUnselectButton(4)).not.toBeInTheDocument();
  });

  it('prevents selecting the same number twice', async () => {
    const user = userEvent.setup();

    drawStars(6);
    render(<Game />);

    const button5 = getNumberButton(5);

    await user.click(button5);
    expect(screen.getAllByRole('button', { name: 'Unselect 5' })).toHaveLength(1);

    await user.click(button5);
    expect(screen.getAllByRole('button', { name: 'Unselect 5' })).toHaveLength(1);
  });

  it('accepts a correct answer and disables the numbers it used', async () => {
    const user = userEvent.setup();

    // 1 + 2 = 3 is correct for this draw; the next draw is scripted too.
    drawStars(3, 7);
    render(<Game />);

    await user.click(getNumberButton(1));
    await user.click(getNumberButton(2));
    await user.click(getCheckAnswerButton());

    const acceptButton = getAcceptAnswerButton();

    expect(acceptButton).toBeInTheDocument();

    await user.click(acceptButton!);

    expect(getNumberButton(1)).toBeDisabled();
    expect(getNumberButton(2)).toBeDisabled();
    expect(getStarsCount()).toBe(7);
    expect(getAllUnselectButtons()).toHaveLength(0);
  });

  it('rejects a wrong answer', async () => {
    const user = userEvent.setup();

    // 1 alone can never equal 9.
    drawStars(9);
    render(<Game />);

    await user.click(getNumberButton(1));
    await user.click(getCheckAnswerButton());

    const wrongButton = screen.getByRole('button', { name: 'Wrong answer' });

    expect(wrongButton).toBeInTheDocument();
    expect(wrongButton).toBeDisabled();
    expect(getAcceptAnswerButton()).not.toBeInTheDocument();
  });

  it('clears the wrong-answer state when the selection changes', async () => {
    const user = userEvent.setup();

    drawStars(9);
    render(<Game />);

    await user.click(getNumberButton(1));
    await user.click(getCheckAnswerButton());
    expect(screen.getByRole('button', { name: 'Wrong answer' })).toBeInTheDocument();

    await user.click(getNumberButton(2));
    expect(screen.queryByRole('button', { name: 'Wrong answer' })).not.toBeInTheDocument();
    expect(getCheckAnswerButton()).toBeEnabled();
  });

  it('decrements the redraw count and clears the selection', async () => {
    const user = userEvent.setup();

    drawStars(6, 2);
    render(<Game />);

    expect(getRedrawsLeft()).toBe(5);

    await user.click(getNumberButton(3));
    expect(getUnselectButton(3)).toBeInTheDocument();

    await user.click(getRedrawButton());

    expect(getRedrawsLeft()).toBe(4);
    expect(getStarsCount()).toBe(2);
    expect(getUnselectButton(3)).not.toBeInTheDocument();
  });

  it('disables the redraw button once no redraws are left', async () => {
    const user = userEvent.setup();

    drawStars(6);
    render(<Game />);

    for (let i = 0; i < 5; i++) {
      expect(getRedrawButton()).toBeEnabled();

      await user.click(getRedrawButton());
    }

    expect(getRedrawButton()).toBeDisabled();
    expect(getRedrawsLeft()).toBe(0);
  });

  it('ends the game when redraws run out and no combination is left', async () => {
    const user = userEvent.setup();

    drawStars(6);

    const possibleCombinationSpy = vi.spyOn(utils, 'possibleCombinationSum').mockReturnValue(false);

    render(<Game />);

    for (let i = 0; i < 5; i++) {
      await user.click(getRedrawButton());
    }

    expect(possibleCombinationSpy).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Game Over!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();
  });

  it('keeps playing when redraws run out but a combination is still possible', async () => {
    const user = userEvent.setup();

    drawStars(6);

    const possibleCombinationSpy = vi.spyOn(utils, 'possibleCombinationSum').mockReturnValue(true);

    render(<Game />);

    for (let i = 0; i < 5; i++) {
      await user.click(getRedrawButton());
    }

    expect(possibleCombinationSpy).toHaveBeenCalledWith([1, 2, 3, 4, 5, 6, 7, 8, 9], 6);
    expect(screen.queryByRole('heading', { name: 'Game Over!' })).not.toBeInTheDocument();
    expect(getAllNumberButtons()).toHaveLength(9);
  });

  it('shows the done frame after every number has been used', async () => {
    const user = userEvent.setup();

    // Draw 1, then 2, ... so each turn is solved by a single number.
    drawStars(1, 2, 3, 4, 5, 6, 7, 8, 9, 1);
    render(<Game />);

    for (let number = 1; number <= 9; number++) {
      await user.click(getNumberButton(number));
      await user.click(getCheckAnswerButton());
      await user.click(getAcceptAnswerButton()!);
    }

    expect(screen.getByRole('heading', { name: 'Done. Nice!' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Number \d/ })).not.toBeInTheDocument();
  });

  it('resets to a fresh board when Play Again is clicked', async () => {
    const user = userEvent.setup();

    drawStars(6);
    vi.spyOn(utils, 'possibleCombinationSum').mockReturnValue(false);

    render(<Game />);

    for (let i = 0; i < 5; i++) {
      await user.click(getRedrawButton());
    }

    await user.click(screen.getByRole('button', { name: 'Play Again' }));

    expect(getAllNumberButtons()).toHaveLength(9);
    expect(getRedrawsLeft()).toBe(5);
    expect(getAllUnselectButtons()).toHaveLength(0);
  });

  it('enables the check button only once a number is selected', async () => {
    const user = userEvent.setup();

    drawStars(6);
    render(<Game />);

    expect(getCheckAnswerButton()).toBeDisabled();

    await user.click(getNumberButton(5));
    expect(getCheckAnswerButton()).toBeEnabled();
  });
});
