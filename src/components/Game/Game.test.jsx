import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Game } from './Game';

describe('Game', () => {
  it('renders and allows selecting then unselecting a number', async () => {
    const user = userEvent.setup();
    const { container } = render(<Game />);

    expect(screen.getByRole('heading', { name: 'Play Nine' })).toBeInTheDocument();
    expect(container.querySelectorAll('#numbers-frame .well > div')).toHaveLength(9);

    await user.click(screen.getByText('4'));
    expect(container.querySelector('#answer-frame .number')).toHaveTextContent('4');

    await user.click(container.querySelector('#answer-frame .number'));
    expect(container.querySelector('#answer-frame .number')).toBeNull();
  });
});
