import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Profile from '../Profile/Profile';
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
    updateDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn()
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
    updateProfile: jest.fn()
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
    success: jest.fn()
}));

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

describe('Profile Component', () => {
    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state when user is loading', () => {
        useAuthState.mockReturnValue([null, true]);
        
        renderWithProviders(<Profile />);
        
        expect(screen.getByText('Loading profile...')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
    });

    test('renders profile header with user information', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
        });
    });

    test('displays user avatar with fallback when no photoURL', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        const userWithoutPhoto = { ...mockUser, photoURL: null };
        
        renderWithProviders(<Profile />, { user: userWithoutPhoto });
        
        await waitFor(() => {
            const avatar = screen.getByAltText('Test User');
            expect(avatar).toBeInTheDocument();
            expect(avatar.src).toContain('ui-avatars.com');
        });
    });

    test('shows member since date', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Member Since')).toBeInTheDocument();
        });
    });

    test('displays booking statistics', async () => {
        const { getDocs } = require('firebase/firestore');
        
        const mockBookingsSnapshot = {
            docs: [
                { id: 'booking1', data: () => ({ userId: 'test-uid', serviceName: 'Service 1', servicePrice: 100 }) },
                { id: 'booking2', data: () => ({ userId: 'test-uid', serviceName: 'Service 2', servicePrice: 50 }) }
            ]
        };
        
        getDocs.mockResolvedValue(mockBookingsSnapshot);
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Total Bookings')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('Total Spent')).toBeInTheDocument();
            expect(screen.getByText('$150')).toBeInTheDocument();
        });
    });

    test('renders overview tab by default', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Personal Information')).toBeInTheDocument();
            expect(screen.getByText('Medical Information')).toBeInTheDocument();
        });
    });

    test('opens edit profile modal when edit button is clicked', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            const editButton = screen.getByText('Edit Profile');
            fireEvent.click(editButton);
        });
        
        await waitFor(() => {
            expect(screen.getByText('Edit Profile')).toBeInTheDocument();
        });
    });

    test('pre-fills form with user data in edit modal', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            const editButton = screen.getByText('Edit Profile');
            fireEvent.click(editButton);
        });
        
        await waitFor(() => {
            const nameInput = screen.getByLabelText(/Full Name/i);
            const emailInput = screen.getByLabelText(/Email Address/i);
            
            expect(nameInput.value).toBe('Test User');
            expect(emailInput.value).toBe('test@example.com');
        });
    });

    test('updates profile successfully', async () => {
        const { getDocs, updateDoc } = require('firebase/firestore');
        const { updateProfile } = require('firebase/auth');
        const { success } = jest.requireMock('react-hot-toast');
        
        getDocs.mockResolvedValue({ docs: [] });
        updateDoc.mockResolvedValue();
        updateProfile.mockResolvedValue();
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            const editButton = screen.getByText('Edit Profile');
            fireEvent.click(editButton);
        });
        
        await waitFor(() => {
            const phoneInput = screen.getByLabelText(/Phone Number/i);
            fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
            
            const saveButton = screen.getByText('Save Changes');
            fireEvent.click(saveButton);
        });
        
        await waitFor(() => {
            expect(updateProfile).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith('Profile updated successfully');
        });
    });

    test('displays booking history in bookings tab', async () => {
        const { getDocs } = require('firebase/firestore');
        
        const mockBookingsSnapshot = {
            docs: [
                { 
                    id: 'booking1', 
                    data: () => ({ 
                        userId: 'test-uid', 
                        serviceName: 'Medical Check-up', 
                        servicePrice: 100,
                        date: { toDate: () => new Date('2023-12-01') },
                        time: '09:00 AM',
                        status: 'confirmed'
                    }) 
                }
            ]
        };
        
        getDocs.mockResolvedValue(mockBookingsSnapshot);
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            const bookingsTab = screen.getByText('Bookings');
            fireEvent.click(bookingsTab);
        });
        
        await waitFor(() => {
            expect(screen.getByText('Medical Check-up')).toBeInTheDocument();
            expect(screen.getByText('$100')).toBeInTheDocument();
            expect(screen.getByText('confirmed')).toBeInTheDocument();
        });
    });

    test('shows no bookings message when user has no bookings', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            const bookingsTab = screen.getByText('Bookings');
            fireEvent.click(bookingsTab);
        });
        
        await waitFor(() => {
            expect(screen.getByText("You haven't made any bookings yet.")).toBeInTheDocument();
        });
    });

    test('renders preferences tab', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({ docs: [] });
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            const preferencesTab = screen.getByText('Preferences');
            fireEvent.click(preferencesTab);
        });
        
        await waitFor(() => {
            expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
            expect(screen.getByText('Email notifications for appointments')).toBeInTheDocument();
            expect(screen.getByText('SMS reminders for upcoming appointments')).toBeInTheDocument();
        });
    });

    test('displays user profile information correctly', async () => {
        const { getDocs } = require('firebase/firestore');
        
        const mockProfileSnapshot = {
            docs: [
                { 
                    id: 'profile1', 
                    data: () => ({ 
                        uid: 'test-uid',
                        displayName: 'Test User',
                        email: 'test@example.com',
                        phone: '123-456-7890',
                        address: '123 Test St',
                        emergencyContact: 'Jane Doe - 987-654-3210',
                        medicalHistory: 'Allergies: Penicillin'
                    }) 
                }
            ]
        };
        
        getDocs.mockImplementation((queryRef) => {
            if (queryRef.toString().includes('users')) {
                return Promise.resolve(mockProfileSnapshot);
            }
            return Promise.resolve({ docs: [] });
        });
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
            expect(screen.getByText('123-456-7890')).toBeInTheDocument();
            expect(screen.getByText('123 Test St')).toBeInTheDocument();
            expect(screen.getByText('Jane Doe - 987-654-3210')).toBeInTheDocument();
            expect(screen.getByText('On file')).toBeInTheDocument(); // Medical history
        });
    });

    test('handles profile creation when no profile exists', async () => {
        const { getDocs, addDoc } = require('firebase/firestore');
        const { updateProfile } = require('firebase/auth');
        const { success } = jest.requireMock('react-hot-toast');
        
        getDocs.mockResolvedValue({ docs: [] }); // No existing profile
        addDoc.mockResolvedValue({ id: 'new-profile-id' });
        updateProfile.mockResolvedValue();
        
        renderWithProviders(<Profile />, { user: mockUser });
        
        await waitFor(() => {
            const editButton = screen.getByText('Edit Profile');
            fireEvent.click(editButton);
        });
        
        await waitFor(() => {
            const phoneInput = screen.getByLabelText(/Phone Number/i);
            fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
            
            const saveButton = screen.getByText('Save Changes');
            fireEvent.click(saveButton);
        });
        
        await waitFor(() => {
            expect(addDoc).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith('Profile updated successfully');
        });
    });
});
