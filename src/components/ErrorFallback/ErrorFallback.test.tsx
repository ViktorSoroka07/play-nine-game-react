import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from './ErrorFallback';

interface ThrowErrorProps {
  shouldThrow: boolean;
}

function ThrowError({ shouldThrow }: ThrowErrorProps) {
  if (shouldThrow) {
    throw new Error('Boom');
  }

  return <div>Child content</div>;
}

describe('ErrorFallback', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('shows fallback UI and allows retry', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: 'Something went wrong.' })).toBeInTheDocument();

    rerender(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
