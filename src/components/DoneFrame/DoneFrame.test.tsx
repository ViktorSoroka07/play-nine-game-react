import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DoneFrame } from './DoneFrame';

describe('DoneFrame', () => {
  it('shows status and calls reset handler', async () => {
    const user = userEvent.setup();
    const resetGame = vi.fn();

    render(<DoneFrame doneStatus="Done. Nice!" resetGame={resetGame} />);

    expect(screen.getByText('Done. Nice!')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Play Again' }));
    expect(resetGame).toHaveBeenCalledTimes(1);
  });
});
