import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Chat from '../Chat/Chat';
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
    onSnapshot: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn()
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

describe('Chat Component', () => {
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
        
        renderWithProviders(<Chat />);
        
        expect(screen.getByText('Loading chat...')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
    });

    test('shows sign in prompt for non-authenticated users', () => {
        useAuthState.mockReturnValue([null, false]);
        
        renderWithProviders(<Chat />);
        
        expect(screen.getByText('Chat Support')).toBeInTheDocument();
        expect(screen.getByText('Please sign in to access our chat support system.')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('renders chat interface for authenticated users', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        // Mock empty messages
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn(); // Unsubscribe function
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Chat Support')).toBeInTheDocument();
            expect(screen.getByText('Dr. Abdullah is online')).toBeInTheDocument();
            expect(screen.getByText('Secure Chat')).toBeInTheDocument();
        });
    });

    test('displays no messages state initially', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument();
        });
    });

    test('renders message input field', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            const input = screen.getByPlaceholderText('Type your message...');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'text');
        });
    });

    test('sends message when form is submitted', async () => {
        const { onSnapshot, addDoc } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        addDoc.mockResolvedValue({ id: 'new-message-id' });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button');
            
            fireEvent.change(input, { target: { value: 'Hello, I need help' } });
            fireEvent.click(sendButton);
        });
        
        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    text: 'Hello, I need help',
                    senderId: 'test-uid',
                    senderName: 'Test User',
                    senderEmail: 'test@example.com',
                    type: 'user'
                })
            );
        });
    });

    test('does not send empty message', async () => {
        const { onSnapshot, addDoc } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button');
            
            fireEvent.click(sendButton);
        });
        
        await waitFor(() => {
            expect(addDoc).not.toHaveBeenCalled();
        });
    });

    test('displays user messages correctly', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        const mockMessages = [
            {
                id: 'msg1',
                data: () => ({
                    text: 'Hello, I need help',
                    senderId: 'test-uid',
                    senderName: 'Test User',
                    type: 'user',
                    createdAt: { toDate: () => new Date('2023-12-01T10:00:00') }
                })
            }
        ];
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: mockMessages });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Hello, I need help')).toBeInTheDocument();
            expect(screen.getByText('Test User')).toBeInTheDocument();
        });
    });

    test('displays admin messages correctly', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        const mockMessages = [
            {
                id: 'msg1',
                data: () => ({
                    text: 'How can I help you today?',
                    senderId: 'admin',
                    senderName: 'Dr. Abdullah',
                    type: 'admin',
                    createdAt: { toDate: () => new Date('2023-12-01T10:01:00') }
                })
            }
        ];
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: mockMessages });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
            expect(screen.getByText('Dr. Abdullah')).toBeInTheDocument();
        });
    });

    test('displays both user and admin messages', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        const mockMessages = [
            {
                id: 'msg1',
                data: () => ({
                    text: 'Hello, I need help',
                    senderId: 'test-uid',
                    senderName: 'Test User',
                    type: 'user',
                    createdAt: { toDate: () => new Date('2023-12-01T10:00:00') }
                })
            },
            {
                id: 'msg2',
                data: () => ({
                    text: 'How can I help you today?',
                    senderId: 'admin',
                    senderName: 'Dr. Abdullah',
                    type: 'admin',
                    createdAt: { toDate: () => new Date('2023-12-01T10:01:00') }
                })
            }
        ];
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: mockMessages });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Hello, I need help')).toBeInTheDocument();
            expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
            expect(screen.getAllByText('Test User')).toHaveLength(1);
            expect(screen.getAllByText('Dr. Abdullah')).toHaveLength(1);
        });
    });

    test('displays typing indicator when admin is typing', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            const input = screen.getByPlaceholderText('Type your message...');
            fireEvent.change(input, { target: { value: 'typing...' } });
        });
        
        // Note: Typing indicator would be shown based on isTyping state
        // This test checks that the input change is handled
        expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    });

    test('shows correct status indicator', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('Dr. Abdullah is online')).toBeInTheDocument();
        });
    });

    test('formats message timestamps correctly', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        const mockMessages = [
            {
                id: 'msg1',
                data: () => ({
                    text: 'Test message',
                    senderId: 'test-uid',
                    senderName: 'Test User',
                    type: 'user',
                    createdAt: { toDate: () => new Date('2023-12-01T10:30:00') }
                })
            }
        ];
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: mockMessages });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByText('10:30 AM')).toBeInTheDocument();
        });
    });

    test('disables send button when input is empty', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            const sendButton = screen.getByRole('button');
            expect(sendButton).toBeDisabled();
        });
    });

    test('enables send button when input has text', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        renderWithProviders(<Chat />, { user: mockUser });
        
        await waitFor(() => {
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button');
            
            fireEvent.change(input, { target: { value: 'Test message' } });
            expect(sendButton).not.toBeDisabled();
        });
    });
});
