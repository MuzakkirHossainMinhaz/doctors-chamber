import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { 
    getDocument, 
    getDocuments, 
    addDocument, 
    updateDocument, 
    deleteDocument, 
    queryDocuments, 
    listenToDocuments 
} from '../firebaseHelpers';

// Mock Firebase
jest.mock('../../firebase.init', () => ({
    db: {}
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    onSnapshot: jest.fn()
}));

describe('Firebase Helper Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDocument', () => {
        test('gets a single document successfully', async () => {
            const mockDoc = { id: 'doc1', data: () => ({ name: 'Test Document' }) };
            getDoc.mockResolvedValue(mockDoc);
            
            const result = await getDocument('collectionName', 'docId');
            
            expect(doc).toHaveBeenCalledWith(expect.any(Object), 'collectionName', 'docId');
            expect(getDoc).toHaveBeenCalled();
            expect(result).toEqual({ id: 'doc1', name: 'Test Document' });
        });

        test('handles document not found', async () => {
            getDoc.mockResolvedValue({ exists: () => false });
            
            const result = await getDocument('collectionName', 'docId');
            
            expect(result).toBeNull();
        });

        test('handles errors', async () => {
            const error = new Error('Firebase error');
            getDoc.mockRejectedValue(error);
            
            await expect(getDocument('collectionName', 'docId')).rejects.toThrow('Firebase error');
        });
    });

    describe('getDocuments', () => {
        test('gets multiple documents successfully', async () => {
            const mockDocs = [
                { id: 'doc1', data: () => ({ name: 'Document 1' }) },
                { id: 'doc2', data: () => ({ name: 'Document 2' }) }
            ];
            getDocs.mockResolvedValue({ docs: mockDocs });
            
            const result = await getDocuments('collectionName');
            
            expect(collection).toHaveBeenCalledWith(expect.any(Object), 'collectionName');
            expect(getDocs).toHaveBeenCalled();
            expect(result).toEqual([
                { id: 'doc1', name: 'Document 1' },
                { id: 'doc2', name: 'Document 2' }
            ]);
        });

        test('handles empty collection', async () => {
            getDocs.mockResolvedValue({ docs: [] });
            
            const result = await getDocuments('collectionName');
            
            expect(result).toEqual([]);
        });

        test('handles errors', async () => {
            const error = new Error('Firebase error');
            getDocs.mockRejectedValue(error);
            
            await expect(getDocuments('collectionName')).rejects.toThrow('Firebase error');
        });
    });

    describe('addDocument', () => {
        test('adds document successfully', async () => {
            const mockDocRef = { id: 'newDocId' };
            addDoc.mockResolvedValue(mockDocRef);
            
            const data = { name: 'New Document' };
            const result = await addDocument('collectionName', data);
            
            expect(collection).toHaveBeenCalledWith(expect.any(Object), 'collectionName');
            expect(addDoc).toHaveBeenCalledWith(expect.any(Object), data);
            expect(result).toEqual({ id: 'newDocId' });
        });

        test('handles errors', async () => {
            const error = new Error('Firebase error');
            addDoc.mockRejectedValue(error);
            
            await expect(addDocument('collectionName', {})).rejects.toThrow('Firebase error');
        });
    });

    describe('updateDocument', () => {
        test('updates document successfully', async () => {
            updateDoc.mockResolvedValue();
            
            const data = { name: 'Updated Document' };
            await updateDocument('collectionName', 'docId', data);
            
            expect(doc).toHaveBeenCalledWith(expect.any(Object), 'collectionName', 'docId');
            expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), data);
        });

        test('handles errors', async () => {
            const error = new Error('Firebase error');
            updateDoc.mockRejectedValue(error);
            
            await expect(updateDocument('collectionName', 'docId', {})).rejects.toThrow('Firebase error');
        });
    });

    describe('deleteDocument', () => {
        test('deletes document successfully', async () => {
            deleteDoc.mockResolvedValue();
            
            await deleteDocument('collectionName', 'docId');
            
            expect(doc).toHaveBeenCalledWith(expect.any(Object), 'collectionName', 'docId');
            expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object));
        });

        test('handles errors', async () => {
            const error = new Error('Firebase error');
            deleteDoc.mockRejectedValue(error);
            
            await expect(deleteDocument('collectionName', 'docId')).rejects.toThrow('Firebase error');
        });
    });

    describe('queryDocuments', () => {
        test('queries documents with single condition', async () => {
            const mockDocs = [
                { id: 'doc1', data: () => ({ name: 'Document 1', status: 'active' }) }
            ];
            getDocs.mockResolvedValue({ docs: mockDocs });
            
            const result = await queryDocuments('collectionName', 'status', '==', 'active');
            
            expect(collection).toHaveBeenCalledWith(expect.any(Object), 'collectionName');
            expect(where).toHaveBeenCalledWith('status', '==', 'active');
            expect(query).toHaveBeenCalled();
            expect(getDocs).toHaveBeenCalled();
            expect(result).toEqual([{ id: 'doc1', name: 'Document 1', status: 'active' }]);
        });

        test('queries documents with ordering', async () => {
            const mockDocs = [
                { id: 'doc1', data: () => ({ name: 'Document 1', createdAt: new Date() }) }
            ];
            getDocs.mockResolvedValue({ docs: mockDocs });
            
            await queryDocuments('collectionName', 'status', '==', 'active', 'createdAt', 'desc');
            
            expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
        });

        test('queries documents with limit', async () => {
            const mockDocs = [
                { id: 'doc1', data: () => ({ name: 'Document 1' }) }
            ];
            getDocs.mockResolvedValue({ docs: mockDocs });
            
            await queryDocuments('collectionName', 'status', '==', 'active', null, null, 10);
            
            expect(limit).toHaveBeenCalledWith(10);
        });

        test('handles empty query results', async () => {
            getDocs.mockResolvedValue({ docs: [] });
            
            const result = await queryDocuments('collectionName', 'status', '==', 'nonexistent');
            
            expect(result).toEqual([]);
        });

        test('handles errors', async () => {
            const error = new Error('Firebase error');
            getDocs.mockRejectedValue(error);
            
            await expect(queryDocuments('collectionName', 'status', '==', 'active')).rejects.toThrow('Firebase error');
        });
    });

    describe('listenToDocuments', () => {
        test('sets up real-time listener', () => {
            const mockUnsubscribe = jest.fn();
            const mockCallback = jest.fn();
            
            onSnapshot.mockReturnValue(mockUnsubscribe);
            
            const unsubscribe = listenToDocuments('collectionName', mockCallback);
            
            expect(collection).toHaveBeenCalledWith(expect.any(Object), 'collectionName');
            expect(onSnapshot).toHaveBeenCalled();
            expect(unsubscribe).toBe(mockUnsubscribe);
        });

        test('calls callback with document data', () => {
            const mockCallback = jest.fn();
            const mockDocs = [
                { id: 'doc1', data: () => ({ name: 'Document 1' }) }
            ];
            
            onSnapshot.mockImplementation((queryRef, callback) => {
                callback({ docs: mockDocs });
                return jest.fn();
            });
            
            listenToDocuments('collectionName', mockCallback);
            
            expect(mockCallback).toHaveBeenCalledWith([{ id: 'doc1', name: 'Document 1' }]);
        });

        test('handles errors in listener', () => {
            const mockCallback = jest.fn();
            const mockError = new Error('Listener error');
            
            onSnapshot.mockImplementation((queryRef, callback, errorCallback) => {
                errorCallback(mockError);
                return jest.fn();
            });
            
            // Should not throw error, but handle it gracefully
            expect(() => {
                listenToDocuments('collectionName', mockCallback);
            }).not.toThrow();
        });
    });

    describe('Error Handling', () => {
        test('handles network errors gracefully', async () => {
            const networkError = new Error('Network error');
            networkError.code = 'unavailable';
            getDoc.mockRejectedValue(networkError);
            
            await expect(getDocument('collectionName', 'docId')).rejects.toThrow('Network error');
        });

        test('handles permission errors gracefully', async () => {
            const permissionError = new Error('Permission denied');
            permissionError.code = 'permission-denied';
            getDoc.mockRejectedValue(permissionError);
            
            await expect(getDocument('collectionName', 'docId')).rejects.toThrow('Permission denied');
        });

        test('handles not found errors gracefully', async () => {
            const notFoundError = new Error('Document not found');
            notFoundError.code = 'not-found';
            getDoc.mockRejectedValue(notFoundError);
            
            await expect(getDocument('collectionName', 'docId')).rejects.toThrow('Document not found');
        });
    });

    describe('Data Transformation', () => {
        test('transforms document data correctly', async () => {
            const mockDoc = { 
                id: 'doc1', 
                data: () => ({ 
                    name: 'Test Document',
                    timestamp: { toDate: () => new Date('2023-12-01') }
                }) 
            };
            getDoc.mockResolvedValue(mockDoc);
            
            const result = await getDocument('collectionName', 'docId');
            
            expect(result).toEqual({
                id: 'doc1',
                name: 'Test Document',
                timestamp: new Date('2023-12-01')
            });
        });

        test('handles nested data structures', async () => {
            const mockDoc = { 
                id: 'doc1', 
                data: () => ({ 
                    user: {
                        name: 'John Doe',
                        profile: {
                            age: 30,
                            preferences: {
                                theme: 'dark'
                            }
                        }
                    }
                }) 
            };
            getDoc.mockResolvedValue(mockDoc);
            
            const result = await getDocument('collectionName', 'docId');
            
            expect(result.user).toEqual({
                name: 'John Doe',
                profile: {
                    age: 30,
                    preferences: {
                        theme: 'dark'
                    }
                }
            });
        });
    });
});
