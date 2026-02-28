import {
    validateEmail,
    validatePhone,
    validateRequired,
    validatePassword,
    validateBookingData,
    sanitizeInput,
    formatPhoneNumber,
    isValidDate,
    isValidTime
} from '../validation';

describe('Validation Utilities', () => {
    describe('validateEmail', () => {
        test('validates correct email addresses', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@domain.co.uk')).toBe(true);
            expect(validateEmail('user+tag@example.org')).toBe(true);
            expect(validateEmail('123@456.com')).toBe(true);
        });

        test('rejects invalid email addresses', () => {
            expect(validateEmail('')).toBe(false);
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('@example.com')).toBe(false);
            expect(validateEmail('user@')).toBe(false);
            expect(validateEmail('user@domain')).toBe(false);
            expect(validateEmail('user name@example.com')).toBe(false);
            expect(validateEmail('user@example')).toBe(false);
        });

        test('handles null and undefined', () => {
            expect(validateEmail(null)).toBe(false);
            expect(validateEmail(undefined)).toBe(false);
        });
    });

    describe('validatePhone', () => {
        test('validates correct phone numbers', () => {
            expect(validatePhone('123-456-7890')).toBe(true);
            expect(validatePhone('(123) 456-7890')).toBe(true);
            expect(validatePhone('1234567890')).toBe(true);
            expect(validatePhone('+1 123 456 7890')).toBe(true);
            expect(validatePhone('123.456.7890')).toBe(true);
        });

        test('rejects invalid phone numbers', () => {
            expect(validatePhone('')).toBe(false);
            expect(validatePhone('123')).toBe(false);
            expect(validatePhone('abc-def-ghij')).toBe(false);
            expect(validatePhone('123-456-78901')).toBe(false);
            expect(validatePhone('12-34-56')).toBe(false);
        });

        test('handles null and undefined', () => {
            expect(validatePhone(null)).toBe(false);
            expect(validatePhone(undefined)).toBe(false);
        });
    });

    describe('validateRequired', () => {
        test('validates required fields', () => {
            expect(validateRequired('test')).toBe(true);
            expect(validateRequired('  test  ')).toBe(true);
            expect(validateRequired('123')).toBe(true);
        });

        test('rejects empty required fields', () => {
            expect(validateRequired('')).toBe(false);
            expect(validateRequired('   ')).toBe(false);
            expect(validateRequired('\t\n')).toBe(false);
        });

        test('handles null and undefined', () => {
            expect(validateRequired(null)).toBe(false);
            expect(validateRequired(undefined)).toBe(false);
        });
    });

    describe('validatePassword', () => {
        test('validates strong passwords', () => {
            expect(validatePassword('StrongPass123!')).toBe(true);
            expect(validatePassword('MyP@ssw0rd')).toBe(true);
            expect(validatePassword('Complex!12345')).toBe(true);
        });

        test('rejects weak passwords', () => {
            expect(validatePassword('weak')).toBe(false);
            expect(validatePassword('12345678')).toBe(false);
            expect(validatePassword('password')).toBe(false);
            expect(validatePassword('PASSWORD')).toBe(false);
            expect(validatePassword('Short1!')).toBe(false);
            expect(validatePassword('NoNumbers!')).toBe(false);
            expect(validatePassword('nospecial123')).toBe(false);
            expect(validatePassword('NOLOWER123!')).toBe(false);
            expect(validatePassword('noupper123!')).toBe(false);
        });

        test('handles null and undefined', () => {
            expect(validatePassword(null)).toBe(false);
            expect(validatePassword(undefined)).toBe(false);
        });
    });

    describe('validateBookingData', () => {
        const validBookingData = {
            patientName: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            date: new Date(),
            time: '09:00 AM'
        };

        test('validates complete booking data', () => {
            expect(validateBookingData(validBookingData)).toBe(true);
        });

        test('rejects incomplete booking data', () => {
            expect(validateBookingData({})).toBe(false);
            expect(validateBookingData({ ...validBookingData, patientName: '' })).toBe(false);
            expect(validateBookingData({ ...validBookingData, email: 'invalid' })).toBe(false);
            expect(validateBookingData({ ...validBookingData, phone: 'invalid' })).toBe(false);
            expect(validateBookingData({ ...validBookingData, date: null })).toBe(false);
            expect(validateBookingData({ ...validBookingData, time: '' })).toBe(false);
        });

        test('handles null and undefined', () => {
            expect(validateBookingData(null)).toBe(false);
            expect(validateBookingData(undefined)).toBe(false);
        });
    });

    describe('sanitizeInput', () => {
        test('removes HTML tags', () => {
            expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
            expect(sanitizeInput('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
            expect(sanitizeInput('<div>Content</div>')).toBe('Content');
        });

        test('trims whitespace', () => {
            expect(sanitizeInput('  test  ')).toBe('test');
            expect(sanitizeInput('\t\n test \n\t')).toBe('test');
        });

        test('handles null and undefined', () => {
            expect(sanitizeInput(null)).toBe('');
            expect(sanitizeInput(undefined)).toBe('');
        });

        test('preserves safe characters', () => {
            expect(sanitizeInput('Hello-World_123')).toBe('Hello-World_123');
            expect(sanitizeInput('Test@email.com')).toBe('Test@email.com');
        });
    });

    describe('formatPhoneNumber', () => {
        test('formats phone numbers consistently', () => {
            expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
            expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
            expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
            expect(formatPhoneNumber('123.456.7890')).toBe('(123) 456-7890');
        });

        test('handles international numbers', () => {
            expect(formatPhoneNumber('+112345678900')).toBe('+1 (123) 456-7890');
            expect(formatPhoneNumber('11234567890')).toBe('(123) 456-7890');
        });

        test('handles invalid input', () => {
            expect(formatPhoneNumber('')).toBe('');
            expect(formatPhoneNumber('invalid')).toBe('invalid');
            expect(formatPhoneNumber('123')).toBe('123');
        });

        test('handles null and undefined', () => {
            expect(formatPhoneNumber(null)).toBe('');
            expect(formatPhoneNumber(undefined)).toBe('');
        });
    });

    describe('isValidDate', () => {
        test('validates correct dates', () => {
            expect(isValidDate(new Date())).toBe(true);
            expect(isValidDate(new Date('2023-12-01'))).toBe(true);
            expect(isValidDate('2023-12-01')).toBe(true);
            expect(isValidDate('12/01/2023')).toBe(true);
        });

        test('rejects invalid dates', () => {
            expect(isValidDate(new Date('invalid'))).toBe(false);
            expect(isValidDate('invalid-date')).toBe(false);
            expect(isValidDate('32/01/2023')).toBe(false);
            expect(isValidDate('02/30/2023')).toBe(false);
        });

        test('handles null and undefined', () => {
            expect(isValidDate(null)).toBe(false);
            expect(isValidDate(undefined)).toBe(false);
        });
    });

    describe('isValidTime', () => {
        test('validates correct time formats', () => {
            expect(isValidTime('09:00 AM')).toBe(true);
            expect(isValidTime('2:30 PM')).toBe(true);
            expect(isValidTime('12:00 PM')).toBe(true);
            expect(isValidTime('11:59 PM')).toBe(true);
            expect(isValidTime('09:00')).toBe(true);
            expect(isValidTime('14:30')).toBe(true);
        });

        test('rejects invalid time formats', () => {
            expect(isValidTime('')).toBe(false);
            expect(isValidTime('invalid')).toBe(false);
            expect(isValidTime('25:00')).toBe(false);
            expect(isValidTime('13:00 PM')).toBe(false);
            expect(isValidTime('09:00 AMM')).toBe(false);
        });

        test('handles null and undefined', () => {
            expect(isValidTime(null)).toBe(false);
            expect(isValidTime(undefined)).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('handles special characters in email validation', () => {
            expect(validateEmail('test+tag@example.com')).toBe(true);
            expect(validateEmail('test.tag@example.co.uk')).toBe(true);
            expect(validateEmail('test@example-domain.com')).toBe(true);
        });

        test('handles various phone number formats', () => {
            expect(validatePhone('+44 20 7946 0958')).toBe(true);
            expect(validatePhone('020 7946 0958')).toBe(true);
            expect(validatePhone('02079460958')).toBe(true);
        });

        test('handles password edge cases', () => {
            expect(validatePassword('A1!aaaaaaaa')).toBe(true);
            expect(validatePassword('AAAAAAAA1!')).toBe(true);
            expect(validatePassword('aaaaaaaa1!')).toBe(true);
            expect(validatePassword('AAAAAA1!')).toBe(false); // Too short
        });

        test('handles booking data with extra fields', () => {
            const bookingWithExtras = {
                patientName: 'John Doe',
                email: 'john@example.com',
                phone: '123-456-7890',
                date: new Date(),
                time: '09:00 AM',
                notes: 'Extra notes',
                emergencyContact: 'Jane Doe'
            };
            
            expect(validateBookingData(bookingWithExtras)).toBe(true);
        });
    });
});
