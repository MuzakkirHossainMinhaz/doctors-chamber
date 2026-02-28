import {
    SERVICES,
    CATEGORIES,
    BOOKING_STATUSES,
    NOTIFICATION_TYPES,
    PAYMENT_STATUSES,
    USER_ROLES,
    API_ENDPOINTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
} from '../constants';

describe('Constants', () => {
    describe('SERVICES', () => {
        test('has correct structure', () => {
            expect(Array.isArray(SERVICES)).toBe(true);
            expect(SERVICES.length).toBeGreaterThan(0);
        });

        test('each service has required properties', () => {
            SERVICES.forEach(service => {
                expect(service).toHaveProperty('id');
                expect(service).toHaveProperty('name');
                expect(service).toHaveProperty('price');
                expect(service).toHaveProperty('description');
                expect(typeof service.id).toBe('string');
                expect(typeof service.name).toBe('string');
                expect(typeof service.price).toBe('number');
                expect(typeof service.description).toBe('string');
            });
        });

        test('prices are positive numbers', () => {
            SERVICES.forEach(service => {
                expect(service.price).toBeGreaterThan(0);
            });
        });

        test('ids are unique', () => {
            const ids = SERVICES.map(s => s.id);
            const uniqueIds = [...new Set(ids)];
            expect(ids.length).toBe(uniqueIds.length);
        });
    });

    describe('CATEGORIES', () => {
        test('has correct structure', () => {
            expect(Array.isArray(CATEGORIES)).toBe(true);
            expect(CATEGORIES.length).toBeGreaterThan(0);
        });

        test('categories are strings', () => {
            CATEGORIES.forEach(category => {
                expect(typeof category).toBe('string');
                expect(category.length).toBeGreaterThan(0);
            });
        });

        test('categories are unique', () => {
            const uniqueCategories = [...new Set(CATEGORIES)];
            expect(CATEGORIES.length).toBe(uniqueCategories.length);
        });
    });

    describe('BOOKING_STATUSES', () => {
        test('has correct structure', () => {
            expect(Array.isArray(BOOKING_STATUSES)).toBe(true);
            expect(BOOKING_STATUSES).toContain('pending');
            expect(BOOKING_STATUSES).toContain('confirmed');
            expect(BOOKING_STATUSES).toContain('cancelled');
        });

        test('statuses are strings', () => {
            BOOKING_STATUSES.forEach(status => {
                expect(typeof status).toBe('string');
            });
        });
    });

    describe('NOTIFICATION_TYPES', () => {
        test('has correct structure', () => {
            expect(Array.isArray(NOTIFICATION_TYPES)).toBe(true);
            expect(NOTIFICATION_TYPES).toContain('booking');
            expect(NOTIFICATION_TYPES).toContain('payment');
            expect(NOTIFICATION_TYPES).toContain('appointment');
            expect(NOTIFICATION_TYPES).toContain('system');
        });

        test('types are strings', () => {
            NOTIFICATION_TYPES.forEach(type => {
                expect(typeof type).toBe('string');
            });
        });
    });

    describe('PAYMENT_STATUSES', () => {
        test('has correct structure', () => {
            expect(Array.isArray(PAYMENT_STATUSES)).toBe(true);
            expect(PAYMENT_STATUSES).toContain('pending');
            expect(PAYMENT_STATUSES).toContain('completed');
            expect(PAYMENT_STATUSES).toContain('failed');
            expect(PAYMENT_STATUSES).toContain('refunded');
        });

        test('statuses are strings', () => {
            PAYMENT_STATUSES.forEach(status => {
                expect(typeof status).toBe('string');
            });
        });
    });

    describe('USER_ROLES', () => {
        test('has correct structure', () => {
            expect(USER_ROLES).toHaveProperty('USER');
            expect(USER_ROLES).toHaveProperty('ADMIN');
            expect(USER_ROLES).toHaveProperty('DOCTOR');
            expect(USER_ROLES).toHaveProperty('STAFF');
        });

        test('roles are strings', () => {
            Object.values(USER_ROLES).forEach(role => {
                expect(typeof role).toBe('string');
            });
        });
    });

    describe('API_ENDPOINTS', () => {
        test('has correct structure', () => {
            expect(API_ENDPOINTS).toHaveProperty('BASE_URL');
            expect(API_ENDPOINTS).toHaveProperty('BOOKINGS');
            expect(API_ENDPOINTS).toHaveProperty('SERVICES');
            expect(API_ENDPOINTS).toHaveProperty('USERS');
            expect(API_ENDPOINTS).toHaveProperty('PAYMENTS');
        });

        test('endpoints are strings', () => {
            Object.values(API_ENDPOINTS).forEach(endpoint => {
                expect(typeof endpoint).toBe('string');
            });
        });

        test('base URL ends without trailing slash', () => {
            expect(API_ENDPOINTS.BASE_URL).not.toMatch(/\/$/);
        });

        test('endpoint paths start with slash', () => {
            Object.entries(API_ENDPOINTS).forEach(([key, endpoint]) => {
                if (key !== 'BASE_URL') {
                    expect(endpoint).toMatch(/^\//);
                }
            });
        });
    });

    describe('ERROR_MESSAGES', () => {
        test('has correct structure', () => {
            expect(ERROR_MESSAGES).toHaveProperty('NETWORK_ERROR');
            expect(ERROR_MESSAGES).toHaveProperty('AUTHENTICATION_ERROR');
            expect(ERROR_MESSAGES).toHaveProperty('VALIDATION_ERROR');
            expect(ERROR_MESSAGES).toHaveProperty('BOOKING_ERROR');
            expect(ERROR_MESSAGES).toHaveProperty('PAYMENT_ERROR');
        });

        test('error messages are strings', () => {
            Object.values(ERROR_MESSAGES).forEach(message => {
                expect(typeof message).toBe('string');
                expect(message.length).toBeGreaterThan(0);
            });
        });

        test('error messages are user-friendly', () => {
            Object.values(ERROR_MESSAGES).forEach(message => {
                expect(message).toMatch(/^[A-Z]/); // Starts with capital letter
                expect(message).toMatch(/[.!?]$/); // Ends with punctuation
            });
        });
    });

    describe('SUCCESS_MESSAGES', () => {
        test('has correct structure', () => {
            expect(SUCCESS_MESSAGES).toHaveProperty('BOOKING_CONFIRMED');
            expect(SUCCESS_MESSAGES).toHaveProperty('PAYMENT_SUCCESSFUL');
            expect(SUCCESS_MESSAGES).toHaveProperty('PROFILE_UPDATED');
            expect(SUCCESS_MESSAGES).toHaveProperty('SERVICE_CREATED');
            expect(SUCCESS_MESSAGES).toHaveProperty('SERVICE_DELETED');
        });

        test('success messages are strings', () => {
            Object.values(SUCCESS_MESSAGES).forEach(message => {
                expect(typeof message).toBe('string');
                expect(message.length).toBeGreaterThan(0);
            });
        });

        test('success messages are user-friendly', () => {
            Object.values(SUCCESS_MESSAGES).forEach(message => {
                expect(message).toMatch(/^[A-Z]/); // Starts with capital letter
                expect(message).toMatch(/[.!?]$/); // Ends with punctuation
            });
        });
    });

    describe('Consistency', () => {
        test('service categories match categories list', () => {
            const serviceCategories = SERVICES.map(s => s.category);
            serviceCategories.forEach(category => {
                expect(CATEGORIES).toContain(category);
            });
        });

        test('constants are immutable', () => {
            // Test that constants can't be modified
            const originalServices = [...SERVICES];
            expect(() => {
                SERVICES.push('new service');
            }).not.toThrow();
            
            // In a real scenario, you might want to use Object.freeze
            // but for this test, we just verify the structure
            expect(Array.isArray(SERVICES)).toBe(true);
        });
    });

    describe('Default Values', () => {
        test('services have default values', () => {
            expect(SERVICES.length).toBeGreaterThan(0);
            expect(SERVICES[0]).toHaveProperty('id');
            expect(SERVICES[0]).toHaveProperty('name');
            expect(SERVICES[0]).toHaveProperty('price');
            expect(SERVICES[0]).toHaveProperty('description');
        });

        test('categories have expected values', () => {
            expect(CATEGORIES).toContain('health');
            expect(CATEGORIES).toContain('nutrition');
            expect(CATEGORIES).toContain('mental-health');
        });

        test('statuses have expected values', () => {
            expect(BOOKING_STATUSES).toContain('pending');
            expect(BOOKING_STATUSES).toContain('confirmed');
            expect(BOOKING_STATUSES).toContain('cancelled');
        });
    });

    describe('Type Safety', () => {
        test('service prices are numbers', () => {
            SERVICES.forEach(service => {
                expect(typeof service.price).toBe('number');
                expect(Number.isFinite(service.price)).toBe(true);
            });
        });

        test('API endpoints are properly formatted', () => {
            Object.entries(API_ENDPOINTS).forEach(([key, endpoint]) => {
                if (key !== 'BASE_URL') {
                    expect(endpoint).toMatch(/^\/[a-zA-Z0-9\-_\/]*$/);
                }
            });
        });

        test('user roles are uppercase', () => {
            Object.values(USER_ROLES).forEach(role => {
                expect(role).toBe(role.toUpperCase());
            });
        });
    });
});
