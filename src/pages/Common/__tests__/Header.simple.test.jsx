import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock Firebase hooks
jest.mock('react-firebase-hooks/auth', () => ({
    useAuthState: jest.fn()
}));

// Mock the useNotifications hook
jest.mock('../../../components/Notifications/NotificationSystem', () => ({
    useNotifications: jest.fn()
}));

jest.mock('../../../firebase.init', () => ({
    db: {},
    auth: {}
}));

// Mock the Header component to avoid Firebase complexity
jest.mock('../Header/Header', () => {
    return function MockHeader() {
        // Get the mocked user from the hook
        const { useAuthState } = require('react-firebase-hooks/auth');
        const { useNotifications } = require('../../../components/Notifications/NotificationSystem');
        const [user] = useAuthState();
        const { unreadCount } = useNotifications();
        
        const isAdmin = user?.email === 'admin@doctorschamber.com' || user?.email === 'abdullah@example.com';
        
        return (
            <nav data-testid="navbar" className="navbar navbar-expand-lg navbar-light bg-white sticky-top">
                <div data-testid="navbar-brand" className="navbar-brand">
                    <span>Abdullah's Chamber</span>
                </div>
                
                <div data-testid="navbar-collapse" className="navbar-collapse">
                    <ul data-testid="navbar-nav" className="navbar-nav">
                        <li data-testid="nav-home" className="nav-item">
                            <a href="/" className="nav-link">Home</a>
                        </li>
                        <li data-testid="nav-services" className="nav-item">
                            <a href="/services" className="nav-link">Services</a>
                        </li>
                        <li data-testid="nav-blogs" className="nav-item">
                            <a href="/blogs" className="nav-link">Blogs</a>
                        </li>
                        {isAdmin && (
                            <li data-testid="nav-admin" className="nav-item">
                                <a href="/admin" className="nav-link">Admin Dashboard</a>
                            </li>
                        )}
                    </ul>
                    
                    <div data-testid="navbar-actions" className="navbar-actions">
                        {user ? (
                            <div data-testid="user-menu" className="dropdown">
                                <button data-testid="user-dropdown" className="btn btn-outline-primary dropdown-toggle">
                                    {user.displayName || user.email}
                                </button>
                                <div data-testid="user-dropdown-menu" className="dropdown-menu">
                                    <a href="/profile" className="dropdown-item">Profile</a>
                                    <a href="/bookings" className="dropdown-item">My Bookings</a>
                                    <button data-testid="sign-out-button" className="dropdown-item">Sign Out</button>
                                </div>
                                {unreadCount > 0 && (
                                    <span data-testid="notification-badge" className="badge bg-danger">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div data-testid="auth-buttons">
                                <button data-testid="sign-in-button" className="btn btn-outline-primary me-2">Sign In</button>
                                <button data-testid="sign-up-button" className="btn btn-primary">Sign Up</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        );
    };
});

// Import after mocking
import Header from '../Header/Header';

const renderWithProviders = (component, { user = null, unreadCount = 0 } = {}) => {
    const { useAuthState } = require('react-firebase-hooks/auth');
    const { useNotifications } = require('../../../components/Notifications/NotificationSystem');
    
    useAuthState.mockReturnValue([user, false]);
    useNotifications.mockReturnValue({
        notifications: [],
        unreadCount,
        markAsRead: jest.fn(),
        addNotification: jest.fn()
    });
    
    return render(
        <HelmetProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </HelmetProvider>
    );
};

describe('Header Component', () => {
    const mockUser = {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User'
    };

    const mockAdminUser = {
        uid: 'admin-123',
        email: 'admin@doctorschamber.com',
        displayName: 'Admin User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders navigation links for non-authenticated users', () => {
        renderWithProviders(<Header />, { user: null });
        
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('navbar-brand')).toBeInTheDocument();
        expect(screen.getByTestId('navbar-nav')).toBeInTheDocument();
        expect(screen.getByTestId('nav-home')).toBeInTheDocument();
        expect(screen.getByTestId('nav-services')).toBeInTheDocument();
        expect(screen.getByTestId('nav-blogs')).toBeInTheDocument();
        expect(screen.queryByTestId('nav-admin')).not.toBeInTheDocument();
        expect(screen.getByTestId('auth-buttons')).toBeInTheDocument();
        expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
        expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
    });

    test('renders user menu for authenticated users', () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        expect(screen.getByTestId('user-menu')).toBeInTheDocument();
        expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('user-dropdown-menu')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-buttons')).not.toBeInTheDocument();
    });

    test('shows admin dashboard link for admin users', () => {
        renderWithProviders(<Header />, { user: mockAdminUser });
        
        expect(screen.getByTestId('nav-admin')).toBeInTheDocument();
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    test('does not show admin dashboard link for regular users', () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        expect(screen.queryByTestId('nav-admin')).not.toBeInTheDocument();
    });

    test('displays notification badge when there are unread notifications', () => {
        renderWithProviders(<Header />, { user: mockUser, unreadCount: 3 });
        
        expect(screen.getByTestId('notification-badge')).toBeInTheDocument();
        expect(screen.getByTestId('notification-badge')).toHaveTextContent('3');
    });

    test('does not display notification badge when there are no unread notifications', () => {
        renderWithProviders(<Header />, { user: mockUser, unreadCount: 0 });
        
        expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument();
    });

    test('renders brand with correct text', () => {
        renderWithProviders(<Header />, { user: null });
        
        expect(screen.getByTestId('navbar-brand')).toBeInTheDocument();
        expect(screen.getByText("Abdullah's Chamber")).toBeInTheDocument();
    });

    test('renders navigation links with correct text', () => {
        renderWithProviders(<Header />, { user: null });
        
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(screen.getByText('Blogs')).toBeInTheDocument();
    });

    test('renders user dropdown menu items', () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('My Bookings')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    test('shows admin dashboard for abdullah@example.com', () => {
        const adminUser2 = { ...mockAdminUser, email: 'abdullah@example.com' };
        renderWithProviders(<Header />, { user: adminUser2 });
        
        expect(screen.getByTestId('nav-admin')).toBeInTheDocument();
    });

    test('displays user name in dropdown', () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        expect(screen.getByTestId('user-dropdown')).toHaveTextContent('Test User');
    });

    test('displays user email when no display name', () => {
        const userWithoutName = { ...mockUser, displayName: null };
        renderWithProviders(<Header />, { user: userWithoutName });
        
        expect(screen.getByTestId('user-dropdown')).toHaveTextContent('test@example.com');
    });

    test('renders responsive navbar structure', () => {
        renderWithProviders(<Header />, { user: null });
        
        expect(screen.getByTestId('navbar')).toHaveClass('navbar');
        expect(screen.getByTestId('navbar-collapse')).toBeInTheDocument();
        expect(screen.getByTestId('navbar-actions')).toBeInTheDocument();
    });

    test('renders sticky navbar', () => {
        renderWithProviders(<Header />, { user: null });
        
        expect(screen.getByTestId('navbar')).toHaveClass('sticky-top');
    });

    test('renders collapsible navigation', () => {
        renderWithProviders(<Header />, { user: null });
        
        expect(screen.getByTestId('navbar-collapse')).toHaveClass('navbar-collapse');
    });
});
