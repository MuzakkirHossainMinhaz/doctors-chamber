import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../Common/LoadingSpinner';

describe('LoadingSpinner Component', () => {
    test('renders with default props', () => {
        render(<LoadingSpinner />);
        
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
    });

    test('renders with custom message', () => {
        render(<LoadingSpinner message="Custom loading message" />);
        
        expect(screen.getByText('Custom loading message')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    test('renders with custom size', () => {
        render(<LoadingSpinner size="sm" />);
        
        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass('spinner-border-sm');
    });

    test('renders with large size', () => {
        render(<LoadingSpinner size="lg" />);
        
        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass('spinner-border-lg');
    });

    test('applies correct CSS classes', () => {
        render(<LoadingSpinner />);
        
        const container = screen.getByText('Loading...').parentElement.parentElement;
        expect(container).toHaveClass('loading-spinner-container');
        
        const content = screen.getByText('Loading...').parentElement;
        expect(content).toHaveClass('loading-spinner-content');
        
        const message = screen.getByText('Loading...');
        expect(message).toHaveClass('loading-message');
    });

    test('renders spinner with correct variant', () => {
        render(<LoadingSpinner />);
        
        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass('text-success');
    });

    test('displays loading message below spinner', () => {
        render(<LoadingSpinner message="Test message" />);
        
        const spinner = screen.getByRole('status');
        const message = screen.getByText('Test message');
        
        expect(spinner).toBeInTheDocument();
        expect(message).toBeInTheDocument();
        
        // Check that message comes after spinner in DOM order
        expect(spinner.compareDocumentPosition(message) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    test('handles empty message gracefully', () => {
        render(<LoadingSpinner message="" />);
        
        expect(screen.getByRole('status')).toBeInTheDocument();
        // Should not display empty message text content
        const messageElement = screen.getByRole('status').nextElementSibling;
        expect(messageElement.textContent).toBe('');
    });

    test('maintains accessibility attributes', () => {
        render(<LoadingSpinner />);
        
        const spinner = screen.getByRole('status');
        expect(spinner).toHaveAttribute('aria-live', 'polite');
    });
});
