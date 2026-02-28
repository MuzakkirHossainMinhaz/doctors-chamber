import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Admin from '../Admin/Admin';

// Mock Firebase hooks
jest.mock('react-firebase-hooks/auth', () => ({
    useAuthState: jest.fn()
}));

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
        
        expect(screen.getByText('Access Denied')).toBeInTheDocument();
        expect(screen.getByText("You don't have permission to access the admin dashboard.")).toBeInTheDocument();
    });

    test('shows access denied for non-authenticated users', () => {
        renderWithProviders(<Admin />, { user: null });
        
        expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    test('renders admin dashboard for admin users', async () => {
        const { collection, getDocs, query, orderBy, limit } = require('firebase/firestore');
        
        // Mock Firestore responses
        const mockUsersSnapshot = {
            docs: [
                { id: '1', data: () => ({ uid: 'user1', email: 'user1@example.com', displayName: 'User One' }) },
                { id: '2', data: () => ({ uid: 'user2', email: 'user2@example.com', displayName: 'User Two' }) }
            ]
        };
        
        const mockBookingsSnapshot = {
            docs: [
                { id: 'booking1', data: () => ({ userId: 'user1', serviceName: 'Test Service', status: 'confirmed', servicePrice: 100 }) }
            ]
        };
        
        const mockServicesSnapshot = {
            docs: [
                { id: 'service1', data: () => ({ name: 'Test Service', price: 100, category: 'general', description: 'Test description' }) }
            ]
        };
        
        getDocs.mockImplementation((queryRef) => {
            if (queryRef.toString().includes('users')) {
                return Promise.resolve(mockUsersSnapshot);
            } else if (queryRef.toString().includes('bookings')) {
                return Promise.resolve(mockBookingsSnapshot);
            } else if (queryRef.toString().includes('services')) {
                return Promise.resolve(mockServicesSnapshot);
            }
            return Promise.resolve({ docs: [] });
        });
        
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        await waitFor(() => {
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Manage your healthcare service platform')).toBeInTheDocument();
        });
    });

    test('displays dashboard statistics', async () => {
        const { getDocs } = require('firebase/firestore');
        
        const mockUsersSnapshot = {
            docs: [
                { id: '1', data: () => ({ uid: 'user1', email: 'user1@example.com' }) },
                { id: '2', data: () => ({ uid: 'user2', email: 'user2@example.com' }) }
            ]
        };
        
        const mockBookingsSnapshot = {
            docs: [
                { id: 'booking1', data: () => ({ userId: 'user1', serviceName: 'Test Service', status: 'confirmed', servicePrice: 100 }) },
                { id: 'booking2', data: () => ({ userId: 'user2', serviceName: 'Another Service', status: 'pending', servicePrice: 50 }) }
            ]
        };
        
        const mockServicesSnapshot = {
            docs: [
                { id: 'service1', data: () => ({ name: 'Test Service', price: 100, category: 'general' }) }
            ]
        };
        
        getDocs.mockImplementation((queryRef) => {
            if (queryRef.toString().includes('users')) {
                return Promise.resolve(mockUsersSnapshot);
            } else if (queryRef.toString().includes('bookings')) {
                return Promise.resolve(mockBookingsSnapshot);
            } else if (queryRef.toString().includes('services')) {
                return Promise.resolve(mockServicesSnapshot);
            }
            return Promise.resolve({ docs: [] });
        });
        
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        await waitFor(() => {
            expect(screen.getByText('Total Users')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument(); // 2 users
            expect(screen.getByText('Total Bookings')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument(); // 2 bookings
            expect(screen.getByText('Total Revenue')).toBeInTheDocument();
            expect(screen.getByText('$150')).toBeInTheDocument(); // 100 + 50
        });
    });

    test('renders navigation tabs', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Services')).toBeInTheDocument();
            expect(screen.getByText('Bookings')).toBeInTheDocument();
            expect(screen.getByText('Users')).toBeInTheDocument();
        });
    });

    test('opens service modal when add service button is clicked', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        await waitFor(() => {
            const addServiceButton = screen.getByText('Add Service');
            fireEvent.click(addServiceButton);
        });
        
        await waitFor(() => {
            expect(screen.getByText('Add New Service')).toBeInTheDocument();
        });
    });

    test('submits service form correctly', async () => {
        const { getDocs, addDoc } = require('firebase/firestore');
        const { success } = jest.requireMock('react-hot-toast');
        
        getDocs.mockResolvedValue({ docs: [] });
        addDoc.mockResolvedValue({ id: 'new-service-id' });
        
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        await waitFor(() => {
            const addServiceButton = screen.getByText('Add Service');
            fireEvent.click(addServiceButton);
        });
        
        await waitFor(() => {
            const nameInput = screen.getByLabelText(/Service Name/i);
            const priceInput = screen.getByLabelText(/Price/i);
            const descriptionInput = screen.getByLabelText(/Description/i);
            
            fireEvent.change(nameInput, { target: { value: 'New Test Service' } });
            fireEvent.change(priceInput, { target: { value: '25' } });
            fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
            
            const submitButton = screen.getByText('Add Service');
            fireEvent.click(submitButton);
        });
        
        await waitFor(() => {
            expect(addDoc).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith('Service added successfully');
        });
    });

    test('deletes service when delete button is clicked', async () => {
        const { getDocs, deleteDoc } = require('firebase/firestore');
        const { success } = jest.requireMock('react-hot-toast');
        
        const mockServicesSnapshot = {
            docs: [
                { id: 'service1', data: () => ({ name: 'Test Service', price: 100, category: 'general' }) }
            ]
        };
        
        getDocs.mockResolvedValue(mockServicesSnapshot);
        deleteDoc.mockResolvedValue();
        
        // Mock window.confirm
        window.confirm = jest.fn(() => true);
        
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        await waitFor(() => {
            const servicesTab = screen.getByText('Services');
            fireEvent.click(servicesTab);
        });
        
        await waitFor(() => {
            const deleteButton = screen.getByText(/Delete/i);
            fireEvent.click(deleteButton);
        });
        
        await waitFor(() => {
            expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this service?');
            expect(deleteDoc).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith('Service deleted successfully');
        });
    });

    test('updates booking status', async () => {
        const { getDocs, updateDoc } = require('firebase/firestore');
        const { success } = jest.requireMock('react-hot-toast');
        
        const mockBookingsSnapshot = {
            docs: [
                { id: 'booking1', data: () => ({ userId: 'user1', serviceName: 'Test Service', status: 'pending', servicePrice: 100 }) }
            ]
        };
        
        getDocs.mockResolvedValue(mockBookingsSnapshot);
        updateDoc.mockResolvedValue();
        
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        await waitFor(() => {
            const bookingsTab = screen.getByText('Bookings');
            fireEvent.click(bookingsTab);
        });
        
        await waitFor(() => {
            const confirmButton = screen.getByText('Confirm');
            fireEvent.click(confirmButton);
        });
        
        await waitFor(() => {
            expect(updateDoc).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith('Booking confirmed successfully');
        });
    });

    test('displays user information correctly', async () => {
        const { getDocs } = require('firebase/firestore');
        
        const mockUsersSnapshot = {
            docs: [
                { id: '1', data: () => ({ uid: 'user1', email: 'user1@example.com', displayName: 'John Doe', phone: '123-456-7890' }) }
            ]
        };
        
        const mockBookingsSnapshot = {
            docs: [
                { id: 'booking1', data: () => ({ userId: 'user1', serviceName: 'Test Service', status: 'confirmed', servicePrice: 100 }) }
            ]
        };
        
        getDocs.mockImplementation((queryRef) => {
            if (queryRef.toString().includes('users')) {
                return Promise.resolve(mockUsersSnapshot);
            } else if (queryRef.toString().includes('bookings')) {
                return Promise.resolve(mockBookingsSnapshot);
            }
            return Promise.resolve({ docs: [] });
        });
        
        renderWithProviders(<Admin />, { user: mockAdminUser });
        
        await waitFor(() => {
            const usersTab = screen.getByText('Users');
            fireEvent.click(usersTab);
        });
        
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('user1@example.com')).toBeInTheDocument();
            expect(screen.getByText('123-456-7890')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument(); // Total bookings
            expect(screen.getByText('$100')).toBeInTheDocument(); // Total spent
        });
    });
});
