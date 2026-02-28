import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Checkout from '../Checkout/Checkout';
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
    getDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn()
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
    success: jest.fn()
}));

// Mock date-fns
jest.mock('date-fns', () => ({
    format: jest.fn(() => '2023-01-01')
}));

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
    loadStripe: jest.fn(() => Promise.resolve({
        elements: jest.fn(),
        createPaymentMethod: jest.fn()
    }))
}));

jest.mock('@stripe/react-stripe-js', () => ({
    Elements: ({ children }) => children,
    CardElement: () => <div data-testid="card-element">Card Input</div>,
    useStripe: () => ({
        createPaymentMethod: jest.fn()
    }),
    useElements: () => ({
        getElement: jest.fn()
    })
}));

// Mock react-datepicker
jest.mock('react-datepicker', () => {
    return function MockDatePicker({ onChange, selected }) {
        return (
            <input
                data-testid="date-picker"
                type="date"
                onChange={(e) => onChange(new Date(e.target.value))}
                value={selected ? selected.toISOString().split('T')[0] : ''}
            />
        );
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

describe('Checkout Component', () => {
    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state when user is loading', () => {
        useAuthState.mockReturnValue([null, true]);
        
        renderWithProviders(<Checkout />);
        
        expect(screen.getByText('Loading checkout...')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
    });

    test('redirects to home when service not found', async () => {
        const mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ id: 'invalid-id' }),
            useNavigate: () => mockNavigate
        }));
        
        renderWithProviders(<Checkout />, { user: mockUser });
        
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    test('renders checkout form when user is authenticated and service exists', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ id: '1' }),
            useNavigate: () => jest.fn()
        }));
        
        renderWithProviders(<Checkout />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Complete Your Booking')).toBeInTheDocument();
            expect(screen.getByText('Schedule your appointment in 3 simple steps')).toBeInTheDocument();
        });
    });

    test('displays patient information form with pre-filled user data', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ id: '1' }),
            useNavigate: () => jest.fn()
        }));
        
        renderWithProviders(<Checkout />, { user: mockUser });
        
        await waitFor(() => {
            const nameInput = screen.getByLabelText(/Full Name/i);
            const emailInput = screen.getByLabelText(/Email Address/i);
            
            expect(nameInput.value).toBe('Test User');
            expect(emailInput.value).toBe('test@example.com');
        });
    });

    test('validates required fields before proceeding to payment', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ id: '1' }),
            useNavigate: () => jest.fn()
        }));
        
        const { error } = jest.requireMock('react-hot-toast');
        
        renderWithProviders(<Checkout />, { user: mockUser });
        
        await waitFor(() => {
            const proceedButton = screen.getByText('Proceed to Payment');
            fireEvent.click(proceedButton);
        });
        
        await waitFor(() => {
            expect(error).toHaveBeenCalledWith('Please enter your phone number');
        });
    });

    test('enables proceed button when date and time are selected', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ id: '1' }),
            useNavigate: () => jest.fn()
        }));
        
        renderWithProviders(<Checkout />, { user: mockUser });
        
        await waitFor(() => {
            // Fill phone number
            const phoneInput = screen.getByLabelText(/Phone Number/i);
            fireEvent.change(phoneInput, { target: { value: '1234567890' } });
            
            // Select date
            const datePicker = screen.getByTestId('date-picker');
            fireEvent.change(datePicker, { target: { value: '2023-12-01' } });
            
            // Select time
            const timeButton = screen.getByText('09:00 AM');
            fireEvent.click(timeButton);
            
            const proceedButton = screen.getByText('Proceed to Payment');
            expect(proceedButton).not.toBeDisabled();
        });
    });

    test('shows booking confirmation after successful payment', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ id: '1' }),
            useNavigate: () => jest.fn()
        }));
        
        const { success } = jest.requireMock('react-hot-toast');
        
        // Mock successful payment
        jest.mock('@stripe/react-stripe-js', () => ({
            Elements: ({ children }) => children,
            CardElement: () => <div data-testid="card-element">Card Input</div>,
            useStripe: () => ({
                createPaymentMethod: jest.fn().mockResolvedValue({
                    paymentMethod: { id: 'test-payment-id' }
                })
            }),
            useElements: () => ({
                getElement: jest.fn()
            })
        }));
        
        renderWithProviders(<Checkout />, { user: mockUser });
        
        await waitFor(() => {
            // Fill form and proceed
            const phoneInput = screen.getByLabelText(/Phone Number/i);
            fireEvent.change(phoneInput, { target: { value: '1234567890' } });
            
            const datePicker = screen.getByTestId('date-picker');
            fireEvent.change(datePicker, { target: { value: '2023-12-01' } });
            
            const timeButton = screen.getByText('09:00 AM');
            fireEvent.click(timeButton);
            
            const proceedButton = screen.getByText('Proceed to Payment');
            fireEvent.click(proceedButton);
        });
        
        await waitFor(() => {
            expect(success).toHaveBeenCalledWith('Booking confirmed successfully!');
        });
    });

    test('displays progress indicator with correct steps', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ id: '1' }),
            useNavigate: () => jest.fn()
        }));
        
        renderWithProviders(<Checkout />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Schedule')).toBeInTheDocument();
            expect(screen.getByText('Payment')).toBeInTheDocument();
        });
    });
});
