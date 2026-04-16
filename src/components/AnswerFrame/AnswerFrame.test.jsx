import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnswerFrame } from './AnswerFrame';

describe('AnswerFrame', () => {
  it('renders selected numbers and calls unselect handler', async () => {
    const user = userEvent.setup();
    const unselectNumber = vi.fn();

    render(<AnswerFrame selectedNumbers={[2, 5]} unselectNumber={unselectNumber} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    await user.click(screen.getByText('5'));
    expect(unselectNumber.mock.calls[0][0]).toBe(5);
  });
});
