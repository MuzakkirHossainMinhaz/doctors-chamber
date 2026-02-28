import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import NotificationSystem, { useNotifications } from '../Notifications/NotificationSystem';
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
    onSnapshot: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn()
}));

// Test component to use the hook
const TestComponent = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotifications();
    
    return (
        <div>
            <div data-testid="unread-count">{unreadCount}</div>
            <div data-testid="notification-count">{notifications.length}</div>
            <button onClick={() => addNotification({
                title: 'Test Notification',
                message: 'Test message',
                type: 'system'
            })}>
                Add Notification
            </button>
            <button onClick={() => markAsRead('test-id')}>
                Mark as Read
            </button>
            <button onClick={markAllAsRead}>
                Mark All as Read
            </button>
        </div>
    );
};

const renderWithProviders = (component, { user = null } = {}) => {
    useAuthState.mockReturnValue([user, false]);
    
    return render(
        <HelmetProvider>
            <NotificationSystem>
                {component}
            </NotificationSystem>
        </HelmetProvider>
    );
};

describe('NotificationSystem', () => {
    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('provides default values when not in context', () => {
        const { getNotifications } = require('../NotificationSystem/NotificationSystem');
        
        // Render component outside of NotificationSystem provider
        const result = getNotifications();
        
        expect(result.notifications).toEqual([]);
        expect(result.unreadCount).toBe(0);
        expect(typeof result.markAsRead).toBe('function');
        expect(typeof result.markAllAsRead).toBe('function');
        expect(typeof result.addNotification).toBe('function');
    });

    test('renders children without errors', () => {
        renderWithProviders(<div data-testid="child">Test Child</div>, { user: mockUser });
        
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    test('sets up Firestore listener for authenticated users', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        const unsubscribe = jest.fn();
        onSnapshot.mockReturnValue(unsubscribe);
        
        const { unmount } = renderWithProviders(<div data-testid="child">Test</div>, { user: mockUser });
        
        await waitFor(() => {
            expect(onSnapshot).toHaveBeenCalled();
        });
        
        // Cleanup
        unmount();
    });

    test('does not set up listener for unauthenticated users', () => {
        const { onSnapshot } = require('firebase/firestore');
        
        renderWithProviders(<div data-testid="child">Test</div>, { user: null });
        
        expect(onSnapshot).not.toHaveBeenCalled();
    });
});

describe('useNotifications Hook', () => {
    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('provides notification data to consumer components', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        const mockNotifications = [
            {
                id: 'notif1',
                data: () => ({
                    title: 'Test Notification',
                    message: 'Test message',
                    type: 'system',
                    read: false,
                    createdAt: new Date()
                })
            },
            {
                id: 'notif2',
                data: () => ({
                    title: 'Another Notification',
                    message: 'Another message',
                    type: 'booking',
                    read: true,
                    createdAt: new Date()
                })
            }
        ];
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: mockNotifications });
            return jest.fn();
        });
        
        renderWithProviders(<TestComponent />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByTestId('notification-count')).toHaveTextContent('2');
            expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
        });
    });

    test('adds notification correctly', async () => {
        const { onSnapshot, addDoc } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        addDoc.mockResolvedValue({ id: 'new-notif-id' });
        
        renderWithProviders(<TestComponent />, { user: mockUser });
        
        await waitFor(() => {
            const addButton = screen.getByText('Add Notification');
            fireEvent.click(addButton);
        });
        
        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    title: 'Test Notification',
                    message: 'Test message',
                    type: 'system',
                    read: false,
                    createdAt: expect.any(Date)
                })
            );
        });
    });

    test('marks notification as read', async () => {
        const { onSnapshot, updateDoc } = require('firebase/firestore');
        
        const mockNotifications = [
            {
                id: 'notif1',
                data: () => ({
                    title: 'Test Notification',
                    message: 'Test message',
                    type: 'system',
                    read: false,
                    createdAt: new Date()
                })
            }
        ];
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: mockNotifications });
            return jest.fn();
        });
        
        updateDoc.mockResolvedValue();
        
        renderWithProviders(<TestComponent />, { user: mockUser });
        
        await waitFor(() => {
            const markReadButton = screen.getByText('Mark as Read');
            fireEvent.click(markReadButton);
        });
        
        await waitFor(() => {
            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    read: true,
                    readAt: expect.any(Date)
                })
            );
        });
    });

    test('marks all notifications as read', async () => {
        const { onSnapshot, updateDoc } = require('firebase/firestore');
        
        const mockNotifications = [
            {
                id: 'notif1',
                data: () => ({
                    title: 'Test Notification 1',
                    message: 'Test message 1',
                    type: 'system',
                    read: false,
                    createdAt: new Date()
                })
            },
            {
                id: 'notif2',
                data: () => ({
                    title: 'Test Notification 2',
                    message: 'Test message 2',
                    type: 'booking',
                    read: false,
                    createdAt: new Date()
                })
            }
        ];
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: mockNotifications });
            return jest.fn();
        });
        
        updateDoc.mockResolvedValue();
        
        renderWithProviders(<TestComponent />, { user: mockUser });
        
        await waitFor(() => {
            const markAllButton = screen.getByText('Mark All as Read');
            fireEvent.click(markAllButton);
        });
        
        await waitFor(() => {
            expect(updateDoc).toHaveBeenCalledTimes(2);
        });
    });

    test('calculates unread count correctly', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        const mockNotifications = [
            {
                id: 'notif1',
                data: () => ({
                    title: 'Unread Notification',
                    message: 'Unread message',
                    type: 'system',
                    read: false,
                    createdAt: new Date()
                })
            },
            {
                id: 'notif2',
                data: () => ({
                    title: 'Read Notification',
                    message: 'Read message',
                    type: 'booking',
                    read: true,
                    createdAt: new Date()
                })
            },
            {
                id: 'notif3',
                data: () => ({
                    title: 'Another Unread',
                    message: 'Another unread message',
                    type: 'payment',
                    read: false,
                    createdAt: new Date()
                })
            }
        ];
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: mockNotifications });
            return jest.fn();
        });
        
        renderWithProviders(<TestComponent />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByTestId('unread-count')).toHaveTextContent('2');
        });
    });

    test('handles empty notifications list', async () => {
        const { onSnapshot } = require('firebase/firestore');
        
        onSnapshot.mockImplementation((queryRef, callback) => {
            callback({ docs: [] });
            return jest.fn();
        });
        
        renderWithProviders(<TestComponent />, { user: mockUser });
        
        await waitFor(() => {
            expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
            expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
        });
    });

    test('filters notifications by user ID', async () => {
        const { onSnapshot, query, where, orderBy, limit } = require('firebase/firestore');
        
        query.mockReturnValue('mock-query');
        where.mockReturnValue('mock-where');
        orderBy.mockReturnValue('mock-orderBy');
        limit.mockReturnValue('mock-limit');
        
        renderWithProviders(<TestComponent />, { user: mockUser });
        
        await waitFor(() => {
            expect(query).toHaveBeenCalled();
            expect(where).toHaveBeenCalledWith('userId', '==', 'test-uid');
            expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
            expect(limit).toHaveBeenCalledWith(50);
        });
    });
});
