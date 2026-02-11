import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Section from '../components/Section';

describe('Section', () => {
  it('renders title and children correctly', () => {
    render(
      <Section title="Test Title" id="test-section">
        <p>Test content</p>
      </Section>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Section title="Test" id="test" className="bg-white">
        <p>Content</p>
      </Section>
    );
    
    const section = container.querySelector('#test');
    expect(section).toHaveClass('bg-white');
    expect(section).toHaveClass('py-16');
  });

  it('renders with correct id attribute', () => {
    const { container } = render(
      <Section id="test-section">
        <p>Content</p>
      </Section>
    );
    
    const section = container.querySelector('#test-section');
    expect(section).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <Section title="Test Title" subtitle="Test Subtitle">
        <p>Content</p>
      </Section>
    );
    
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('centers content when centered prop is true', () => {
    const { container } = render(
      <Section title="Test" centered>
        <p>Content</p>
      </Section>
    );
    
    const titleContainer = container.querySelector('.text-center');
    expect(titleContainer).toBeInTheDocument();
  });

  it('renders without title and subtitle', () => {
    const { container } = render(
      <Section id="test">
        <p>Content only</p>
      </Section>
    );
    
    expect(screen.getByText('Content only')).toBeInTheDocument();
    expect(container.querySelector('h2')).not.toBeInTheDocument();
  });
});
