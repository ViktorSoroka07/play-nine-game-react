import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NumbersFrame } from './NumbersFrame';

describe('NumbersFrame', () => {
  it('renders numbers 1 through 9 with state classes', () => {
    const { container } = render(
      <NumbersFrame usedNumbers={[2]} selectedNumbers={[3]} selectNumber={vi.fn()} />,
    );

    for (let i = 1; i <= 9; i += 1) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }

    expect(container.querySelector('.selected-true.used-false')).toHaveTextContent('3');
    expect(container.querySelector('.selected-false.used-true')).toHaveTextContent('2');
  });

  it('calls selectNumber only for unused numbers', async () => {
    const user = userEvent.setup();
    const selectNumber = vi.fn();

    render(<NumbersFrame usedNumbers={[1]} selectedNumbers={[]} selectNumber={selectNumber} />);

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('4'));

    expect(selectNumber).toHaveBeenCalledTimes(1);
    expect(selectNumber).toHaveBeenCalledWith(4);
  });
});
