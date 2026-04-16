import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NumbersFrame } from './NumbersFrame';

describe('NumbersFrame', () => {
  it('applies selected/used class flags based on input arrays', () => {
    render(<NumbersFrame usedNumbers={[2, 3]} selectedNumbers={[1, 3]} selectNumber={vi.fn()} />);

    expect(screen.getByText('1')).toHaveClass('number', 'selected-true', 'used-false');
    expect(screen.getByText('2')).toHaveClass('number', 'selected-false', 'used-true');
    expect(screen.getByText('3')).toHaveClass('number', 'selected-true', 'used-true');
    expect(screen.getByText('4')).toHaveClass('number', 'selected-false', 'used-false');
  });

  it('does not call selectNumber when clicking a used number', async () => {
    const user = userEvent.setup();
    const selectNumber = vi.fn();

    render(<NumbersFrame usedNumbers={[2]} selectedNumbers={[]} selectNumber={selectNumber} />);

    await user.click(screen.getByText('2'));
    expect(selectNumber).not.toHaveBeenCalled();
  });
});
