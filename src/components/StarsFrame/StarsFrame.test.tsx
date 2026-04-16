import { render } from '@testing-library/react';

import { StarsFrame } from './StarsFrame';

describe('StarsFrame', () => {
  it('renders the expected number of stars', () => {
    const { container } = render(<StarsFrame numberOfStars={4} />);

    expect(container.querySelectorAll('.glyphicon-star')).toHaveLength(4);
  });
});
