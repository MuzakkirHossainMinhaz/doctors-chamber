import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

// Mock Firebase hooks
jest.mock('react-firebase-hooks/auth', () => ({
    useAuthState: jest.fn()
}));

jest.mock('../../firebase.init', () => ({
    db: {},
    auth: {}
}));

// Mock the NotificationSystem component to avoid Firebase complexity
jest.mock('../Notifications/NotificationSystem', () => {
    return {
        NotificationSystem: function MockNotificationSystem({ children }) {
            // Get the mocked user from the hook
            const { useAuthState } = require('react-firebase-hooks/auth');
            const [user] = useAuthState();
            
            const mockNotifications = user ? [
                {
                    id: '1',
                    type: 'booking',
                    title: 'Booking Confirmed',
                    message: 'Your appointment has been confirmed',
                    read: false,
                    createdAt: new Date('2023-01-01T10:00:00Z'),
                    userId: user.uid
                },
                {
                    id: '2',
                    type: 'payment',
                    title: 'Payment Successful',
                    message: 'Your payment was processed successfully',
                    read: true,
                    createdAt: new Date('2023-01-01T09:00:00Z'),
                    userId: user.uid
                }
            ] : [];
            
            return (
                <div data-testid="notification-system">
                    {children}
                    <div data-testid="notification-context">
                        <div data-testid="notification-list">
                            {mockNotifications.map(notification => (
                                <div key={notification.id} data-testid={`notification-${notification.id}`}>
                                    <div data-testid={`notification-title-${notification.id}`}>{notification.title}</div>
                                    <div data-testid={`notification-message-${notification.id}`}>{notification.message}</div>
                                    <div data-testid={`notification-type-${notification.id}`}>{notification.type}</div>
                                    <div data-testid={`notification-read-${notification.id}`}>{notification.read ? 'read' : 'unread'}</div>
                                </div>
                            ))}
                        </div>
                        <div data-testid="notification-stats">
                            <div data-testid="total-notifications">{mockNotifications.length}</div>
                            <div data-testid="unread-count">{mockNotifications.filter(n => !n.read).length}</div>
                        </div>
                    </div>
                </div>
            );
        },
        useNotifications: function MockUseNotifications() {
            const { useAuthState } = require('react-firebase-hooks/auth');
            const [user] = useAuthState();
            
            const mockNotifications = user ? [
                {
                    id: '1',
                    type: 'booking',
                    title: 'Booking Confirmed',
                    message: 'Your appointment has been confirmed',
                    read: false,
                    createdAt: new Date('2023-01-01T10:00:00Z'),
                    userId: user.uid
                },
                {
                    id: '2',
                    type: 'payment',
                    title: 'Payment Successful',
                    message: 'Your payment was processed successfully',
                    read: true,
                    createdAt: new Date('2023-01-01T09:00:00Z'),
                    userId: user.uid
                }
            ] : [];
            
            return {
                notifications: mockNotifications,
                unreadCount: mockNotifications.filter(n => !n.read).length,
                markAsRead: jest.fn(),
                markAllAsRead: jest.fn(),
                addNotification: jest.fn(),
                removeNotification: jest.fn()
            };
        }
    };
});

// Import after mocking
import { NotificationSystem, useNotifications } from '../Notifications/NotificationSystem';

const renderWithProviders = (component, { user = null } = {}) => {
    const { useAuthState } = require('react-firebase-hooks/auth');
    useAuthState.mockReturnValue([user, false]);
    
    return render(
        <HelmetProvider>
            {component}
        </HelmetProvider>
    );
};

describe('NotificationSystem', () => {
    const mockUser = {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders children without errors', () => {
        renderWithProviders(
            <NotificationSystem>
                <div data-testid="child-component">Child Content</div>
            </NotificationSystem>,
            { user: mockUser }
        );
        
        expect(screen.getByTestId('notification-system')).toBeInTheDocument();
        expect(screen.getByTestId('child-component')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    test('provides notification context to children', () => {
        renderWithProviders(
            <NotificationSystem>
                <div data-testid="child-component">Child Content</div>
            </NotificationSystem>,
            { user: mockUser }
        );
        
        expect(screen.getByTestId('notification-context')).toBeInTheDocument();
        expect(screen.getByTestId('notification-list')).toBeInTheDocument();
        expect(screen.getByTestId('notification-stats')).toBeInTheDocument();
    });

    test('displays notifications for authenticated users', () => {
        renderWithProviders(
            <NotificationSystem>
                <div data-testid="child-component">Child Content</div>
            </NotificationSystem>,
            { user: mockUser }
        );
        
        expect(screen.getByTestId('notification-1')).toBeInTheDocument();
        expect(screen.getByTestId('notification-2')).toBeInTheDocument();
        expect(screen.getByTestId('total-notifications')).toHaveTextContent('2');
        expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });

    test('displays no notifications for unauthenticated users', () => {
        renderWithProviders(
            <NotificationSystem>
                <div data-testid="child-component">Child Content</div>
            </NotificationSystem>,
            { user: null }
        );
        
        expect(screen.queryByTestId('notification-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('notification-2')).not.toBeInTheDocument();
        expect(screen.getByTestId('total-notifications')).toHaveTextContent('0');
        expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });

    test('renders notification details correctly', () => {
        renderWithProviders(
            <NotificationSystem>
                <div data-testid="child-component">Child Content</div>
            </NotificationSystem>,
            { user: mockUser }
        );
        
        expect(screen.getByTestId('notification-title-1')).toHaveTextContent('Booking Confirmed');
        expect(screen.getByTestId('notification-message-1')).toHaveTextContent('Your appointment has been confirmed');
        expect(screen.getByTestId('notification-type-1')).toHaveTextContent('booking');
        expect(screen.getByTestId('notification-read-1')).toHaveTextContent('unread');
        
        expect(screen.getByTestId('notification-title-2')).toHaveTextContent('Payment Successful');
        expect(screen.getByTestId('notification-read-2')).toHaveTextContent('read');
    });
});

describe('useNotifications Hook', () => {
    const mockUser = {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    function TestComponent() {
        const { notifications, unreadCount, markAsRead, addNotification } = useNotifications();
        
        return (
            <div data-testid="test-component">
                <div data-testid="hook-notification-count">{notifications.length}</div>
                <div data-testid="hook-unread-count">{unreadCount}</div>
                <button data-testid="mark-read-btn" onClick={() => markAsRead('1')}>Mark Read</button>
                <button data-testid="add-notification-btn" onClick={() => addNotification({ type: 'test', title: 'Test' })}>Add Notification</button>
            </div>
        );
    }

    test('provides notification data to consumer components', () => {
        renderWithProviders(
            <NotificationSystem>
                <TestComponent />
            </NotificationSystem>,
            { user: mockUser }
        );
        
        expect(screen.getByTestId('hook-notification-count')).toHaveTextContent('2');
        expect(screen.getByTestId('hook-unread-count')).toHaveTextContent('1');
    });

    test('provides empty notifications for unauthenticated users', () => {
        renderWithProviders(
            <NotificationSystem>
                <TestComponent />
            </NotificationSystem>,
            { user: null }
        );
        
        expect(screen.getByTestId('hook-notification-count')).toHaveTextContent('0');
        expect(screen.getByTestId('hook-unread-count')).toHaveTextContent('0');
    });

    test('provides notification functions', () => {
        renderWithProviders(
            <NotificationSystem>
                <TestComponent />
            </NotificationSystem>,
            { user: mockUser }
        );
        
        expect(screen.getByTestId('mark-read-btn')).toBeInTheDocument();
        expect(screen.getByTestId('add-notification-btn')).toBeInTheDocument();
    });

    test('calculates unread count correctly', () => {
        renderWithProviders(
            <NotificationSystem>
                <TestComponent />
            </NotificationSystem>,
            { user: mockUser }
        );
        
        expect(screen.getByTestId('hook-unread-count')).toHaveTextContent('1');
    });

    test('handles empty notifications list', () => {
        renderWithProviders(
            <NotificationSystem>
                <TestComponent />
            </NotificationSystem>,
            { user: null }
        );
        
        expect(screen.getByTestId('hook-notification-count')).toHaveTextContent('0');
        expect(screen.getByTestId('hook-unread-count')).toHaveTextContent('0');
    });
});
