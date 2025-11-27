import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
};

// Component that works fine
const WorkingComponent = () => {
  return <div>Working Component</div>;
};

const RouterWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <RouterWrapper>
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      </RouterWrapper>
    );

    expect(screen.getByText('Working Component')).toBeInTheDocument();
  });

  it('renders error fallback when child component throws', () => {
    render(
      <RouterWrapper>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </RouterWrapper>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('displays error message in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <RouterWrapper>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </RouterWrapper>
    );

    expect(screen.getByText(/test error/i)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});
