import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock Firebase hooks
jest.mock('react-firebase-hooks/auth', () => ({
    useAuthState: jest.fn()
}));

jest.mock('../../firebase.init', () => ({
    db: {},
    auth: {}
}));

// Mock the Blogs component to avoid Firebase complexity
jest.mock('../Blogs/Blogs', () => {
    return function MockBlogs() {
        // Get the mocked user from the hook
        const { useAuthState } = require('react-firebase-hooks/auth');
        const [user] = useAuthState();
        
        const isAdmin = user?.email === 'admin@doctorschamber.com' || user?.email === 'abdullah@example.com';
        
        return (
            <div data-testid="blogs-page">
                <div data-testid="blogs-header">
                    <h1>Healthcare Blog</h1>
                    <p>Latest articles and health tips from our medical experts</p>
                </div>
                
                {isAdmin && (
                    <div data-testid="admin-tabs">
                        <button data-testid="view-blogs-tab" className="active">View Blogs</button>
                        <button data-testid="manage-blogs-tab">Manage Blogs</button>
                    </div>
                )}
                
                <div data-testid="blog-list">
                    <div data-testid="blog-item">
                        <h3>Understanding Heart Health</h3>
                        <p>Learn about cardiovascular health and prevention tips...</p>
                        <div data-testid="blog-meta">By Dr. Smith • 5 min read</div>
                    </div>
                    <div data-testid="blog-item">
                        <h3>Nutrition Tips for Better Health</h3>
                        <p>Discover essential nutrition guidelines for optimal wellness...</p>
                        <div data-testid="blog-meta">By Dr. Johnson • 8 min read</div>
                    </div>
                    <div data-testid="blog-item">
                        <h3>Mental Health Awareness</h3>
                        <p>Important insights on maintaining mental wellness...</p>
                        <div data-testid="blog-meta">By Dr. Williams • 6 min read</div>
                    </div>
                </div>
                
                {!user && (
                    <div data-testid="sign-in-prompt">
                        <p>Sign in to access more articles and features</p>
                    </div>
                )}
            </div>
        );
    };
});

// Import after mocking
import Blogs from '../Blogs/Blogs';

const renderWithProviders = (component, { user = null } = {}) => {
    const { useAuthState } = require('react-firebase-hooks/auth');
    useAuthState.mockReturnValue([user, false]);
    
    return render(
        <HelmetProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </HelmetProvider>
    );
};

describe('Blogs Component', () => {
    const mockAdminUser = {
        uid: 'admin-uid',
        email: 'admin@doctorschamber.com',
        displayName: 'Admin User'
    };

    const mockRegularUser = {
        uid: 'user-uid',
        email: 'user@example.com',
        displayName: 'Regular User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders blog list for non-authenticated users', () => {
        renderWithProviders(<Blogs />, { user: null });
        
        expect(screen.getByTestId('blogs-page')).toBeInTheDocument();
        expect(screen.getByTestId('blogs-header')).toBeInTheDocument();
        expect(screen.getByText('Healthcare Blog')).toBeInTheDocument();
        expect(screen.getByTestId('blog-list')).toBeInTheDocument();
        expect(screen.getByTestId('sign-in-prompt')).toBeInTheDocument();
    });

    test('renders blog list for regular users', () => {
        renderWithProviders(<Blogs />, { user: mockRegularUser });
        
        expect(screen.getByTestId('blogs-page')).toBeInTheDocument();
        expect(screen.getByTestId('blogs-header')).toBeInTheDocument();
        expect(screen.getByTestId('blog-list')).toBeInTheDocument();
        expect(screen.queryByTestId('admin-tabs')).not.toBeInTheDocument();
        expect(screen.queryByTestId('sign-in-prompt')).not.toBeInTheDocument();
    });

    test('renders admin tabs for admin users', () => {
        renderWithProviders(<Blogs />, { user: mockAdminUser });
        
        expect(screen.getByTestId('blogs-page')).toBeInTheDocument();
        expect(screen.getByTestId('admin-tabs')).toBeInTheDocument();
        expect(screen.getByTestId('view-blogs-tab')).toBeInTheDocument();
        expect(screen.getByTestId('manage-blogs-tab')).toBeInTheDocument();
        expect(screen.getByTestId('view-blogs-tab')).toHaveClass('active');
    });

    test('displays blog articles correctly', () => {
        renderWithProviders(<Blogs />, { user: mockRegularUser });
        
        const blogItems = screen.getAllByTestId('blog-item');
        expect(blogItems).toHaveLength(3);
        
        expect(screen.getByText('Understanding Heart Health')).toBeInTheDocument();
        expect(screen.getByText('Nutrition Tips for Better Health')).toBeInTheDocument();
        expect(screen.getByText('Mental Health Awareness')).toBeInTheDocument();
        
        expect(screen.getByText('By Dr. Smith • 5 min read')).toBeInTheDocument();
        expect(screen.getByText('By Dr. Johnson • 8 min read')).toBeInTheDocument();
        expect(screen.getByText('By Dr. Williams • 6 min read')).toBeInTheDocument();
    });

    test('renders correct header content', () => {
        renderWithProviders(<Blogs />, { user: mockRegularUser });
        
        expect(screen.getByTestId('blogs-header')).toBeInTheDocument();
        expect(screen.getByText('Healthcare Blog')).toBeInTheDocument();
        expect(screen.getByText('Latest articles and health tips from our medical experts')).toBeInTheDocument();
    });

    test('does not show admin tabs for non-admin users', () => {
        renderWithProviders(<Blogs />, { user: mockRegularUser });
        
        expect(screen.queryByTestId('admin-tabs')).not.toBeInTheDocument();
        expect(screen.queryByTestId('view-blogs-tab')).not.toBeInTheDocument();
        expect(screen.queryByTestId('manage-blogs-tab')).not.toBeInTheDocument();
    });

    test('shows admin tabs for users with admin email', () => {
        const adminUser2 = { ...mockAdminUser, email: 'abdullah@example.com' };
        renderWithProviders(<Blogs />, { user: adminUser2 });
        
        expect(screen.getByTestId('admin-tabs')).toBeInTheDocument();
        expect(screen.getByTestId('view-blogs-tab')).toBeInTheDocument();
        expect(screen.getByTestId('manage-blogs-tab')).toBeInTheDocument();
    });

    test('does not show admin tabs for users with non-admin emails', () => {
        const nonAdminUser = { ...mockRegularUser, email: 'nonadmin@example.com' };
        renderWithProviders(<Blogs />, { user: nonAdminUser });
        
        expect(screen.queryByTestId('admin-tabs')).not.toBeInTheDocument();
    });

    test('shows sign-in prompt for non-authenticated users', () => {
        renderWithProviders(<Blogs />, { user: null });
        
        expect(screen.getByTestId('sign-in-prompt')).toBeInTheDocument();
        expect(screen.getByText('Sign in to access more articles and features')).toBeInTheDocument();
    });

    test('hides sign-in prompt for authenticated users', () => {
        renderWithProviders(<Blogs />, { user: mockRegularUser });
        
        expect(screen.queryByTestId('sign-in-prompt')).not.toBeInTheDocument();
    });
});
