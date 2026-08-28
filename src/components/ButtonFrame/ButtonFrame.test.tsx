import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ButtonFrame } from './ButtonFrame';
import { getCheckAnswerButton } from '../../test/selectors';

describe('ButtonFrame', () => {
  it('renders check button and triggers checkAnswer', async () => {
    const user = userEvent.setup();
    const checkAnswer = vi.fn();

    render(
      <ButtonFrame
        answerStatus="unchecked"
        acceptAnswer={vi.fn()}
        redraw={vi.fn()}
        redraws={5}
        selectedNumbers={[1]}
        checkAnswer={checkAnswer}
      />
    );

    await user.click(getCheckAnswerButton());
    expect(checkAnswer).toHaveBeenCalledTimes(1);
  });

  it('renders success button when answer is correct', async () => {
    const user = userEvent.setup();
    const acceptAnswer = vi.fn();

    render(
      <ButtonFrame
        answerStatus="correct"
        acceptAnswer={acceptAnswer}
        redraw={vi.fn()}
        redraws={5}
        selectedNumbers={[1]}
        checkAnswer={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Accept answer' }));
    expect(acceptAnswer).toHaveBeenCalledTimes(1);
  });

  it('renders wrong-answer state and redraw disabled when no redraws left', () => {
    render(
      <ButtonFrame
        answerStatus="wrong"
        acceptAnswer={vi.fn()}
        redraw={vi.fn()}
        redraws={0}
        selectedNumbers={[1]}
        checkAnswer={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Wrong answer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Redraw' })).toBeDisabled();
  });
});
