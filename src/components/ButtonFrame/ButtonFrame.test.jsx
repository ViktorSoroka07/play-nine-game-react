import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ButtonFrame } from './ButtonFrame';

describe('ButtonFrame', () => {
  it('renders check button and triggers checkAnswer', async () => {
    const user = userEvent.setup();
    const checkAnswer = vi.fn();

    render(
      <ButtonFrame
        correct={null}
        acceptAnswer={vi.fn()}
        redraw={vi.fn()}
        redraws={5}
        selectedNumbers={[1]}
        checkAnswer={checkAnswer}
      />,
    );

    await user.click(screen.getByRole('button', { name: '=' }));
    expect(checkAnswer).toHaveBeenCalledTimes(1);
  });

  it('renders success button when answer is correct', async () => {
    const user = userEvent.setup();
    const acceptAnswer = vi.fn();
    const { container } = render(
      <ButtonFrame
        correct={true}
        acceptAnswer={acceptAnswer}
        redraw={vi.fn()}
        redraws={5}
        selectedNumbers={[1]}
        checkAnswer={vi.fn()}
      />,
    );

    await user.click(container.querySelector('.btn-success'));
    expect(acceptAnswer).toHaveBeenCalledTimes(1);
  });

  it('renders wrong-answer state and redraw disabled when no redraws left', () => {
    const { container } = render(
      <ButtonFrame
        correct={false}
        acceptAnswer={vi.fn()}
        redraw={vi.fn()}
        redraws={0}
        selectedNumbers={[1]}
        checkAnswer={vi.fn()}
      />,
    );

    expect(container.querySelector('.btn-danger')).toBeInTheDocument();
    expect(container.querySelector('.btn-warning')).toBeDisabled();
  });
});
