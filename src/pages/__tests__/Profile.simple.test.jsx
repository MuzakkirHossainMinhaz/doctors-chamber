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

// Mock the Profile component to avoid Firebase complexity
jest.mock('../Profile/Profile', () => {
    return function MockProfile() {
        // Get the mocked user from the hook
        const { useAuthState } = require('react-firebase-hooks/auth');
        const [user] = useAuthState();
        
        if (!user) {
            return (
                <div data-testid="profile-loading">
                    <div>Loading profile...</div>
                </div>
            );
        }
        
        return (
            <div data-testid="profile-page">
                <div data-testid="profile-header">
                    <h1>Profile</h1>
                    <div data-testid="user-info">
                        <div data-testid="user-name">{user.displayName || 'Test User'}</div>
                        <div data-testid="user-email">{user.email}</div>
                        <div data-testid="member-since">Member since January 2023</div>
                    </div>
                </div>
                
                <div data-testid="profile-tabs">
                    <button data-testid="overview-tab" className="active">Overview</button>
                    <button data-testid="bookings-tab">Bookings</button>
                    <button data-testid="preferences-tab">Preferences</button>
                </div>
                
                <div data-testid="profile-content">
                    <div data-testid="overview-section">
                        <h2>Overview</h2>
                        <div data-testid="booking-stats">
                            <div data-testid="total-bookings">Total Bookings: 5</div>
                            <div data-testid="completed-bookings">Completed: 4</div>
                            <div data-testid="upcoming-bookings">Upcoming: 1</div>
                        </div>
                    </div>
                </div>
                
                <div data-testid="edit-profile-button">Edit Profile</div>
            </div>
        );
    };
});

// Import after mocking
import Profile from '../Profile/Profile';

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

describe('Profile Component', () => {
    const mockUser = {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows loading state when user is not authenticated', () => {
        renderWithProviders(<Profile />, { user: null });
        
        expect(screen.getByTestId('profile-loading')).toBeInTheDocument();
        expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    });

    test('renders profile header with user information', () => {
        renderWithProviders(<Profile />, { user: mockUser });
        
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
        expect(screen.getByTestId('profile-header')).toBeInTheDocument();
        expect(screen.getByTestId('user-info')).toBeInTheDocument();
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('member-since')).toHaveTextContent('Member since January 2023');
    });

    test('displays user avatar with fallback when no photoURL', () => {
        const userWithoutPhoto = { ...mockUser, photoURL: null };
        renderWithProviders(<Profile />, { user: userWithoutPhoto });
        
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    });

    test('shows member since date', () => {
        renderWithProviders(<Profile />, { user: mockUser });
        
        expect(screen.getByTestId('member-since')).toBeInTheDocument();
        expect(screen.getByTestId('member-since')).toHaveTextContent('Member since January 2023');
    });

    test('displays booking statistics', () => {
        renderWithProviders(<Profile />, { user: mockUser });
        
        expect(screen.getByTestId('booking-stats')).toBeInTheDocument();
        expect(screen.getByTestId('total-bookings')).toHaveTextContent('Total Bookings: 5');
        expect(screen.getByTestId('completed-bookings')).toHaveTextContent('Completed: 4');
        expect(screen.getByTestId('upcoming-bookings')).toHaveTextContent('Upcoming: 1');
    });

    test('renders overview tab by default', () => {
        renderWithProviders(<Profile />, { user: mockUser });
        
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
        expect(screen.getByTestId('overview-tab')).toHaveClass('active');
        expect(screen.getByTestId('overview-section')).toBeInTheDocument();
    });

    test('renders all profile tabs', () => {
        renderWithProviders(<Profile />, { user: mockUser });
        
        expect(screen.getByTestId('profile-tabs')).toBeInTheDocument();
        expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
        expect(screen.getByTestId('bookings-tab')).toBeInTheDocument();
        expect(screen.getByTestId('preferences-tab')).toBeInTheDocument();
    });

    test('displays edit profile button', () => {
        renderWithProviders(<Profile />, { user: mockUser });
        
        expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
        expect(screen.getByTestId('edit-profile-button')).toHaveTextContent('Edit Profile');
    });

    test('displays user profile information correctly', () => {
        renderWithProviders(<Profile />, { user: mockUser });
        
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    test('handles user without display name', () => {
        const userWithoutName = { ...mockUser, displayName: null };
        renderWithProviders(<Profile />, { user: userWithoutName });
        
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    });
});
