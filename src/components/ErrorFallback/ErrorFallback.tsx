import type { FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="well text-center" role="alert">
      <h2>Something went wrong.</h2>
      <button type="button" className="btn btn-default" onClick={resetErrorBoundary}>
        Try Again
      </button>
    </div>
  );
}
