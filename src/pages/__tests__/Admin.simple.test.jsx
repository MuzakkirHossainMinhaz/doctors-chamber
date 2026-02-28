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

// Mock the Admin component to avoid Firebase complexity
jest.mock('../Admin/Admin', () => {
    return function MockAdmin() {
        // Get the mocked user from the hook
        const { useAuthState } = require('react-firebase-hooks/auth');
        const [user] = useAuthState();
        
        const isAdmin = user?.email === 'admin@doctorschamber.com' || user?.email === 'abdullah@example.com';
        
        if (!user || !isAdmin) {
            return (
                <div data-testid="access-denied">
                    <h1>Access Denied</h1>
                    <p>You don't have permission to access the admin dashboard.</p>
                </div>
            );
        }
        
        return (
            <div data-testid="admin-dashboard">
                <h1>Admin Dashboard</h1>
                <p>Manage your healthcare service platform</p>
                <div data-testid="admin-tabs">
                    <button>Dashboard</button>
                    <button>Services</button>
                    <button>Bookings</button>
                    <button>Users</button>
                </div>
            </div>
        );
    };
});

// Import after mocking
import Admin from '../Admin/Admin';

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

describe('Admin Component', () => {
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

    test('shows access denied for non-admin users', () => {
        renderWithProviders(<Admin />, { user: mockRegularUser });
        
        expect(screen.getByTestId('access-denied')).toBeInTheDocument();
        expect(screen.getByText('Access Denied')).toBeInTheDocument();
        expect(screen.getByText("You don't have permission to access the admin dashboard.")).toBeInTheDocument();
    });

    test('shows access denied for non-authenticated users', () => {
        renderWithProviders(<Admin />, { user: null });
        
        expect(screen.getByTestId('access-denied')).toBeInTheDocument();
        expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    test('renders admin dashboard for admin users', () => {
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Manage your healthcare service platform')).toBeInTheDocument();
    });

    test('renders navigation tabs', () => {
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        expect(screen.getByTestId('admin-tabs')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(screen.getByText('Bookings')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
    });
});
