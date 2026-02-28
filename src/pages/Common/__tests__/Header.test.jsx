import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from '../Header/Header';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNotifications } from '../../../components/Notifications/NotificationSystem';

// Mock Firebase hooks
jest.mock('react-firebase-hooks/auth');
jest.mock('../../../firebase.init', () => ({
    auth: {}
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
    signOut: jest.fn()
}));

// Mock notifications hook
jest.mock('../../../components/Notifications/NotificationSystem');

const renderWithProviders = (component, { user = null, unreadCount = 0 } = {}) => {
    useAuthState.mockReturnValue([user, false]);
    useNotifications.mockReturnValue({
        notifications: [],
        unreadCount,
        markAsRead: jest.fn(),
        markAllAsRead: jest.fn(),
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
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User'
    };

    const mockAdminUser = {
        uid: 'admin-uid',
        email: 'admin@doctorschamber.com',
        displayName: 'Admin User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders logo and navigation links', () => {
        renderWithProviders(<Header />);
        
        expect(screen.getByText("Abdullah's Chamber")).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
        expect(screen.getByText('Blogs')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    test('shows signin link for non-authenticated users', () => {
        renderWithProviders(<Header />, { user: null });
        
        expect(screen.getByText('Signin')).toBeInTheDocument();
        expect(screen.queryByText('Account')).not.toBeInTheDocument();
    });

    test('shows account dropdown for authenticated users', () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        expect(screen.queryByText('Signin')).not.toBeInTheDocument();
        expect(screen.getByText('Account')).toBeInTheDocument();
    });

    test('displays unread notification count', () => {
        renderWithProviders(<Header />, { user: mockUser, unreadCount: 3 });
        
        const badge = screen.getByText('3');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('bg-danger');
    });

    test('does not display notification badge when count is zero', () => {
        renderWithProviders(<Header />, { user: mockUser, unreadCount: 0 });
        
        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    test('opens account dropdown when clicked', async () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        const accountDropdown = screen.getByText('Account');
        fireEvent.click(accountDropdown);
        
        await waitFor(() => {
            expect(screen.getByText('Profile')).toBeInTheDocument();
            expect(screen.getByText('Chat Support')).toBeInTheDocument();
            expect(screen.getByText('Book Appointment')).toBeInTheDocument();
            expect(screen.getByText('Sign Out')).toBeInTheDocument();
        });
    });

    test('shows admin dashboard link for admin users', async () => {
        renderWithProviders(<Header />, { user: mockAdminUser });
        
        const accountDropdown = screen.getByText('Account');
        fireEvent.click(accountDropdown);
        
        await waitFor(() => {
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        });
    });

    test('does not show admin dashboard link for regular users', async () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        const accountDropdown = screen.getByText('Account');
        fireEvent.click(accountDropdown);
        
        await waitFor(() => {
            expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
        });
    });

    test('calls signOut when sign out is clicked', async () => {
        const { signOut } = require('firebase/auth');
        signOut.mockResolvedValue();
        
        renderWithProviders(<Header />, { user: mockUser });
        
        const accountDropdown = screen.getByText('Account');
        fireEvent.click(accountDropdown);
        
        await waitFor(() => {
            const signOutButton = screen.getByText('Sign Out');
            fireEvent.click(signOutButton);
        });
        
        await waitFor(() => {
            expect(signOut).toHaveBeenCalled();
        });
    });

    test('renders navigation links with correct href attributes', () => {
        renderWithProviders(<Header />);
        
        const blogsLink = screen.getByText('Blogs');
        expect(blogsLink.closest('a')).toHaveAttribute('href', '/blogs');
        
        const aboutLink = screen.getByText('About');
        expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    });

    test('renders dropdown items with correct links', async () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        const accountDropdown = screen.getByText('Account');
        fireEvent.click(accountDropdown);
        
        await waitFor(() => {
            const profileLink = screen.getByText('Profile');
            expect(profileLink.closest('a')).toHaveAttribute('href', '/profile');
            
            const chatLink = screen.getByText('Chat Support');
            expect(chatLink.closest('a')).toHaveAttribute('href', '/chat');
            
            const bookingLink = screen.getByText('Book Appointment');
            expect(bookingLink.closest('a')).toHaveAttribute('href', '/checkout');
        });
    });

    test('displays correct icons in dropdown items', async () => {
        renderWithProviders(<Header />, { user: mockUser });
        
        const accountDropdown = screen.getByText('Account');
        fireEvent.click(accountDropdown);
        
        await waitFor(() => {
            expect(screen.getByText('Profile')).toBeInTheDocument();
            expect(screen.getByText('Chat Support')).toBeInTheDocument();
            expect(screen.getByText('Book Appointment')).toBeInTheDocument();
            expect(screen.getByText('Sign Out')).toBeInTheDocument();
        });
    });

    test('shows admin dashboard for abdullah@example.com', async () => {
        const abdullahUser = {
            uid: 'abdullah-uid',
            email: 'abdullah@example.com',
            displayName: 'Abdullah'
        };
        
        renderWithProviders(<Header />, { user: abdullahUser });
        
        const accountDropdown = screen.getByText('Account');
        fireEvent.click(accountDropdown);
        
        await waitFor(() => {
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        });
    });

    test('notification badge has correct styling', () => {
        renderWithProviders(<Header />, { user: mockUser, unreadCount: 5 });
        
        const badge = screen.getByText('5');
        expect(badge).toHaveStyle({ fontSize: '0.6rem' });
    });

    test('renders responsive navbar', () => {
        renderWithProviders(<Header />);
        
        const navbar = screen.getByRole('navigation');
        expect(navbar).toHaveClass('navbar');
        expect(navbar).toHaveClass('navbar-expand-lg');
        expect(navbar).toHaveClass('bg-success');
    });

    test('renders sticky navbar', () => {
        renderWithProviders(<Header />);
        
        const navbar = screen.getByRole('navigation');
        expect(navbar).toHaveClass('sticky-top');
    });

    test('renders brand with correct styling', () => {
        renderWithProviders(<Header />);
        
        const brand = screen.getByText("Abdullah's Chamber");
        expect(brand).toHaveClass('navbar-brand');
        expect(brand).toHaveClass('header-logo');
        expect(brand).toHaveClass('fs-3');
    });

    test('renders collapsible navigation', () => {
        renderWithProviders(<Header />);
        
        const toggle = screen.getByRole('button', { name: /toggle navigation/i });
        expect(toggle).toBeInTheDocument();
        expect(toggle).toHaveClass('navbar-toggler');
    });
});
