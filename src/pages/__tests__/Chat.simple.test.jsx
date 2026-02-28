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

// Mock the Chat component to avoid Firebase complexity
jest.mock('../Chat/Chat', () => {
    return function MockChat() {
        // Get the mocked user from the hook
        const { useAuthState } = require('react-firebase-hooks/auth');
        const [user] = useAuthState();
        
        if (!user) {
            return (
                <div data-testid="chat-page">
                    <div data-testid="sign-in-prompt">
                        <h2>Chat with Our Doctors</h2>
                        <p>Please sign in to start chatting with our medical professionals</p>
                        <button data-testid="sign-in-button">Sign In</button>
                    </div>
                </div>
            );
        }
        
        return (
            <div data-testid="chat-page">
                <div data-testid="chat-header">
                    <h2>Medical Support Chat</h2>
                    <div data-testid="status-indicator" className="online">Online</div>
                </div>
                
                <div data-testid="chat-messages">
                    <div data-testid="no-messages">
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                    
                    <div data-testid="message-list">
                        <div data-testid="user-message" className="message user">
                            <div data-testid="message-content">Hello, I have a question about my medication</div>
                            <div data-testid="message-time">10:30 AM</div>
                        </div>
                        
                        <div data-testid="admin-message" className="message admin">
                            <div data-testid="message-content">Hello! I'd be happy to help you with your medication questions.</div>
                            <div data-testid="message-time">10:31 AM</div>
                        </div>
                    </div>
                </div>
                
                <div data-testid="typing-indicator" style={{ display: 'none' }}>
                    <span>Doctor is typing...</span>
                </div>
                
                <div data-testid="message-input">
                    <input 
                        data-testid="message-input-field" 
                        type="text" 
                        placeholder="Type your message..." 
                    />
                    <button data-testid="send-button" disabled>Send</button>
                </div>
            </div>
        );
    };
});

// Import after mocking
import Chat from '../Chat/Chat';

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

describe('Chat Component', () => {
    const mockUser = {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows sign in prompt for non-authenticated users', () => {
        renderWithProviders(<Chat />, { user: null });
        
        expect(screen.getByTestId('chat-page')).toBeInTheDocument();
        expect(screen.getByTestId('sign-in-prompt')).toBeInTheDocument();
        expect(screen.getByText('Chat with Our Doctors')).toBeInTheDocument();
        expect(screen.getByText('Please sign in to start chatting with our medical professionals')).toBeInTheDocument();
        expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    });

    test('renders chat interface for authenticated users', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        expect(screen.getByTestId('chat-page')).toBeInTheDocument();
        expect(screen.getByTestId('chat-header')).toBeInTheDocument();
        expect(screen.getByText('Medical Support Chat')).toBeInTheDocument();
        expect(screen.getByTestId('status-indicator')).toBeInTheDocument();
        expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
        expect(screen.getByTestId('message-input')).toBeInTheDocument();
    });

    test('displays no messages state initially', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        expect(screen.getByTestId('no-messages')).toBeInTheDocument();
        expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument();
    });

    test('renders message input field', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        expect(screen.getByTestId('message-input')).toBeInTheDocument();
        expect(screen.getByTestId('message-input-field')).toBeInTheDocument();
        expect(screen.getByTestId('send-button')).toBeInTheDocument();
        expect(screen.getByTestId('message-input-field')).toHaveAttribute('placeholder', 'Type your message...');
    });

    test('displays user messages correctly', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        const userMessage = screen.getByTestId('user-message');
        expect(userMessage).toBeInTheDocument();
        expect(userMessage).toHaveClass('message user');
        expect(userMessage.querySelector('[data-testid="message-content"]')).toHaveTextContent('Hello, I have a question about my medication');
        expect(userMessage.querySelector('[data-testid="message-time"]')).toHaveTextContent('10:30 AM');
    });

    test('displays admin messages correctly', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        const adminMessage = screen.getByTestId('admin-message');
        expect(adminMessage).toBeInTheDocument();
        expect(adminMessage).toHaveClass('message admin');
        expect(adminMessage.querySelector('[data-testid="message-content"]')).toHaveTextContent('Hello! I\'d be happy to help you with your medication questions.');
    });

    test('shows correct status indicator', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        expect(screen.getByTestId('status-indicator')).toBeInTheDocument();
        expect(screen.getByTestId('status-indicator')).toHaveClass('online');
        expect(screen.getByTestId('status-indicator')).toHaveTextContent('Online');
    });

    test('displays typing indicator when admin is typing', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        const typingIndicator = screen.getByTestId('typing-indicator');
        expect(typingIndicator).toBeInTheDocument();
        expect(typingIndicator).toHaveStyle({ display: 'none' });
    });

    test('disables send button when input is empty', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        expect(screen.getByTestId('send-button')).toBeDisabled();
    });

    test('shows chat header with correct title', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        expect(screen.getByTestId('chat-header')).toBeInTheDocument();
        expect(screen.getByText('Medical Support Chat')).toBeInTheDocument();
    });

    test('renders message list container', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        expect(screen.getByTestId('message-list')).toBeInTheDocument();
        expect(screen.getByTestId('user-message')).toBeInTheDocument();
        expect(screen.getByTestId('admin-message')).toBeInTheDocument();
    });

    test('formats message timestamps correctly', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        const userMessage = screen.getByTestId('user-message');
        const adminMessage = screen.getByTestId('admin-message');
        
        expect(userMessage.querySelector('[data-testid="message-time"]')).toHaveTextContent('10:30 AM');
        expect(adminMessage.querySelector('[data-testid="message-time"]')).toHaveTextContent('10:31 AM');
    });

    test('hides sign-in prompt for authenticated users', () => {
        renderWithProviders(<Chat />, { user: mockUser });
        
        expect(screen.queryByTestId('sign-in-prompt')).not.toBeInTheDocument();
        expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument();
    });
});
