import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Blogs from '../Blogs/Blogs';
import { useAuthState } from 'react-firebase-hooks/auth';

// Mock Firebase hooks
jest.mock('react-firebase-hooks/auth');
jest.mock('../../firebase.init', () => ({
    db: {},
    auth: {}
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn()
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
    success: jest.fn()
}));

// Mock child components
jest.mock('../Blogs/BlogList', () => {
    return function MockBlogList() {
        return <div data-testid="blog-list">Blog List Component</div>;
    };
});

jest.mock('../Blogs/BlogCMS', () => {
    return function MockBlogCMS() {
        return <div data-testid="blog-cms">Blog CMS Component</div>;
    };
});

const renderWithProviders = (component, { user = null } = {}) => {
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

    test('renders loading state when user is loading', () => {
        useAuthState.mockReturnValue([null, true]);
        
        renderWithProviders(<Blogs />);
        
        expect(screen.getByText('Loading blogs...')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
    });

    test('renders blog list for regular users', async () => {
        renderWithProviders(<Blogs />, { user: mockRegularUser });
        
        await waitFor(() => {
            expect(screen.getByText('Healthcare Blog')).toBeInTheDocument();
            expect(screen.getByText('Expert insights on health, wellness, and medical care')).toBeInTheDocument();
            expect(screen.getByTestId('blog-list')).toBeInTheDocument();
        });
    });

    test('renders tabs for admin users', async () => {
        renderWithProviders(<Blogs />, { user: mockAdminUser });
        
        await waitFor(() => {
            expect(screen.getByText('View Blogs')).toBeInTheDocument();
            expect(screen.getByText('Manage Blogs')).toBeInTheDocument();
        });
    });

    test('shows blog list by default for admin users', async () => {
        renderWithProviders(<Blogs />, { user: mockAdminUser });
        
        await waitFor(() => {
            expect(screen.getByTestId('blog-list')).toBeInTheDocument();
            expect(screen.queryByTestId('blog-cms')).not.toBeInTheDocument();
        });
    });

    test('switches to manage blogs tab when clicked', async () => {
        renderWithProviders(<Blogs />, { user: mockAdminUser });
        
        await waitFor(() => {
            const manageTab = screen.getByText('Manage Blogs');
            fireEvent.click(manageTab);
        });
        
        await waitFor(() => {
            expect(screen.getByTestId('blog-cms')).toBeInTheDocument();
            expect(screen.queryByTestId('blog-list')).not.toBeInTheDocument();
        });
    });

    test('switches back to view blogs tab', async () => {
        renderWithProviders(<Blogs />, { user: mockAdminUser });
        
        await waitFor(() => {
            const manageTab = screen.getByText('Manage Blogs');
            fireEvent.click(manageTab);
        });
        
        await waitFor(() => {
            expect(screen.getByTestId('blog-cms')).toBeInTheDocument();
            
            const viewTab = screen.getByText('View Blogs');
            fireEvent.click(viewTab);
        });
        
        await waitFor(() => {
            expect(screen.getByTestId('blog-list')).toBeInTheDocument();
            expect(screen.queryByTestId('blog-cms')).not.toBeInTheDocument();
        });
    });

    test('renders correct header content', async () => {
        renderWithProviders(<Blogs />, { user: mockRegularUser });
        
        await waitFor(() => {
            expect(screen.getByText('Healthcare Blog')).toBeInTheDocument();
            expect(screen.getByText('Expert insights on health, wellness, and medical care')).toBeInTheDocument();
        });
    });

    test('does not show tabs for non-admin users', async () => {
        renderWithProviders(<Blogs />, { user: mockRegularUser });
        
        await waitFor(() => {
            expect(screen.queryByText('View Blogs')).not.toBeInTheDocument();
            expect(screen.queryByText('Manage Blogs')).not.toBeInTheDocument();
        });
    });

    test('shows tabs for admin users with correct email', async () => {
        const adminWithDifferentEmail = {
            uid: 'admin-uid',
            email: 'abdullah@example.com',
            displayName: 'Abdullah'
        };
        
        renderWithProviders(<Blogs />, { user: adminWithDifferentEmail });
        
        await waitFor(() => {
            expect(screen.getByText('View Blogs')).toBeInTheDocument();
            expect(screen.getByText('Manage Blogs')).toBeInTheDocument();
        });
    });

    test('does not show tabs for users with non-admin emails', async () => {
        const nonAdminUser = {
            uid: 'user-uid',
            email: 'notadmin@example.com',
            displayName: 'Regular User'
        };
        
        renderWithProviders(<Blogs />, { user: nonAdminUser });
        
        await waitFor(() => {
            expect(screen.queryByText('View Blogs')).not.toBeInTheDocument();
            expect(screen.queryByText('Manage Blogs')).not.toBeInTheDocument();
        });
    });
});
