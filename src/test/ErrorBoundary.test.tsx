import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

const NoError = () => <div>No error</div>;

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <NoError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();
    expect(screen.getByText(/Попробовать снова/i)).toBeInTheDocument();
    expect(screen.getByText(/На главную/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const customFallback = <div>Custom error message</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    
    spy.mockRestore();
  });
});
