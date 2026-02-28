import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage Hook', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        
        // Mock localStorage methods
        const localStorageMock = (() => {
            let store = {};
            return {
                getItem: jest.fn((key) => store[key] || null),
                setItem: jest.fn((key, value) => {
                    store[key] = value.toString();
                }),
                removeItem: jest.fn((key) => {
                    delete store[key];
                }),
                clear: jest.fn(() => {
                    store = {};
                }),
            };
        })();
        
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
        });
    });

    test('returns initial value from localStorage', () => {
        localStorage.setItem('test-key', JSON.stringify('test-value'));
        
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        
        expect(result.current[0]).toBe('test-value');
    });

    test('returns default value when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
        
        expect(result.current[0]).toBe('default-value');
    });

    test('updates localStorage when value changes', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        
        act(() => {
            result.current[1]('new-value');
        });
        
        expect(result.current[0]).toBe('new-value');
        expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
    });

    test('handles complex objects', () => {
        const testObject = { name: 'John', age: 30 };
        const { result } = renderHook(() => useLocalStorage('user', {}));
        
        act(() => {
            result.current[1](testObject);
        });
        
        expect(result.current[0]).toEqual(testObject);
        expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(testObject));
    });

    test('handles arrays', () => {
        const testArray = [1, 2, 3];
        const { result } = renderHook(() => useLocalStorage('numbers', []));
        
        act(() => {
            result.current[1](testArray);
        });
        
        expect(result.current[0]).toEqual(testArray);
        expect(localStorage.setItem).toHaveBeenCalledWith('numbers', JSON.stringify(testArray));
    });

    test('handles boolean values', () => {
        const { result } = renderHook(() => useLocalStorage('isLoggedIn', false));
        
        act(() => {
            result.current[1](true);
        });
        
        expect(result.current[0]).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', JSON.stringify(true));
    });

    test('handles null values', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        
        act(() => {
            result.current[1](null);
        });
        
        expect(result.current[0]).toBeNull();
        expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(null));
    });

    test('handles undefined values', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', undefined));
        
        expect(result.current[0]).toBeUndefined();
        // When initial value is undefined, no localStorage operation is performed initially
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(localStorage.removeItem).not.toHaveBeenCalled();
    });

    test('handles function updates', () => {
        const { result } = renderHook(() => useLocalStorage('counter', 0));
        
        act(() => {
            result.current[1]((prev) => prev + 1);
        });
        
        expect(result.current[0]).toBe(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('counter', JSON.stringify(1));
    });

    test('persists across re-renders', () => {
        const { result, rerender } = renderHook(() => useLocalStorage('test-key', 'default'));
        
        act(() => {
            result.current[1]('persistent-value');
        });
        
        rerender();
        
        expect(result.current[0]).toBe('persistent-value');
    });

    test('handles JSON parsing errors gracefully', () => {
        // Mock localStorage to return invalid JSON
        localStorage.getItem.mockReturnValue('invalid json');
        
        // Mock console.error to avoid test output
        const originalConsoleError = console.error;
        console.error = jest.fn();
        
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        
        expect(result.current[0]).toBe('default');
        expect(console.error).toHaveBeenCalledWith('Error reading localStorage key "test-key":', expect.any(Error));
        
        // Restore console
        console.error = originalConsoleError;
    });

    test('works with different data types', () => {
        const testCases = [
            { key: 'string', value: 'test string', defaultValue: '' },
            { key: 'number', value: 42, defaultValue: 0 },
            { key: 'boolean', value: true, defaultValue: false },
            { key: 'object', value: { a: 1, b: 2 }, defaultValue: {} },
            { key: 'array', value: [1, 2, 3], defaultValue: [] },
            { key: 'null', value: null, defaultValue: 'default' }
        ];

        testCases.forEach(({ key, value, defaultValue }) => {
            const { result } = renderHook(() => useLocalStorage(key, defaultValue));
            
            act(() => {
                result.current[1](value);
            });
            
            expect(result.current[0]).toEqual(value);
        });
    });

    test('handles localStorage errors gracefully', () => {
        // Mock localStorage to throw an error
        const mockSetItem = jest.fn(() => {
            throw new Error('Storage quota exceeded');
        });
        
        // Mock console.error to avoid test output
        const originalConsoleError = console.error;
        console.error = jest.fn();
        
        // Override the mock temporarily
        localStorage.setItem.mockImplementation(mockSetItem);

        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        
        // Should not throw error
        expect(() => {
            act(() => {
                result.current[1]('test-value');
            });
        }).not.toThrow();

        // Should have logged the error
        expect(console.error).toHaveBeenCalledWith('Error setting localStorage key "test-key":', expect.any(Error));

        // Restore the original mock and console
        localStorage.setItem.mockRestore();
        console.error = originalConsoleError;
    });

    test('initializes with default value when key exists but is empty', () => {
        localStorage.setItem('test-key', '');
        
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        
        expect(result.current[0]).toBe('default');
    });

    test('removes item when value is undefined', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        
        act(() => {
            result.current[1](undefined);
        });
        
        expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    test('syncs with external localStorage changes', () => {
        const { result } = renderHook(() => useLocalStorage('sync-test', 'initial'));
        
        // Simulate external change
        act(() => {
            localStorage.setItem('sync-test', JSON.stringify('external-change'));
            // Trigger re-render by changing the value
            result.current[1]('trigger-change');
        });
        
        act(() => {
            result.current[1]('external-change');
        });
        
        expect(result.current[0]).toBe('external-change');
    });

    test('handles large objects', () => {
        const largeObject = {
            data: new Array(1000).fill(0).map((_, i) => ({ id: i, value: `item-${i}` }))
        };
        
        const { result } = renderHook(() => useLocalStorage('large-data', {}));
        
        act(() => {
            result.current[1](largeObject);
        });
        
        expect(result.current[0]).toEqual(largeObject);
        expect(JSON.parse(localStorage.setItem.mock.calls[0][1])).toEqual(largeObject);
    });

    test('preserves data types through JSON serialization', () => {
        const date = new Date('2023-01-01');
        const { result } = renderHook(() => useLocalStorage('date-test', date));
        
        // Dates become strings when serialized to JSON
        expect(typeof result.current[0]).toBe('object');
        expect(result.current[0]).toBeInstanceOf(Date);
    });
});
