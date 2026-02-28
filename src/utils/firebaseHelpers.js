import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.init";

// Helper function to get a single document
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      `Error getting document ${docId} from ${collectionName}:`,
      error,
    );
    throw error;
  }
};

// Helper function to get multiple documents
export const getDocuments = async (collectionName, constraints = []) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

// Helper function to add a document
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
    });

    return { id: docRef.id, ...data, createdAt: new Date() };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

// Helper function to update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });

    return { id: docId, ...data, updatedAt: new Date() };
  } catch (error) {
    console.error(
      `Error updating document ${docId} in ${collectionName}:`,
      error,
    );
    throw error;
  }
};

// Helper function to delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);

    return { id: docId };
  } catch (error) {
    console.error(
      `Error deleting document ${docId} from ${collectionName}:`,
      error,
    );
    throw error;
  }
};

// Helper function to query documents
export const queryDocuments = async (
  collectionName,
  field,
  operator,
  value,
  orderByField = null,
  orderDirection = "asc",
  limitCount = null,
) => {
  try {
    const constraints = [where(field, operator, value)];

    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection));
    }

    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    return await getDocuments(collectionName, constraints);
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

// Helper function to listen to real-time updates
export const listenToDocuments = (
  collectionName,
  callback,
  constraints = [],
) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(documents);
      },
      (error) => {
        console.error(
          `Error listening to documents from ${collectionName}:`,
          error,
        );
      },
    );

    return unsubscribe;
  } catch (error) {
    console.error(`Error setting up listener for ${collectionName}:`, error);
    throw error;
  }
};

// Helper function for batch operations
export const batchOperation = async (operations) => {
  // Note: Firebase doesn't have built-in batch operations in the v9 modular API
  // You would need to import writeBatch from firebase/firestore
  // This is a placeholder for future implementation
  try {
    const results = [];
    for (const operation of operations) {
      const result = await operation();
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error("Error in batch operation:", error);
    throw error;
  }
};

// Helper function to get documents with pagination
export const getPaginatedDocuments = async (
  collectionName,
  pageSize = 10,
  startAfter = null,
  orderByField = "createdAt",
  orderDirection = "desc",
) => {
  try {
    const constraints = [
      orderBy(orderByField, orderDirection),
      limit(pageSize),
    ];

    if (startAfter) {
      constraints.push(startAfter(startAfter));
    }

    return await getDocuments(collectionName, constraints);
  } catch (error) {
    console.error(
      `Error getting paginated documents from ${collectionName}:`,
      error,
    );
    throw error;
  }
};

// Helper function to search documents
export const searchDocuments = async (
  collectionName,
  searchFields,
  searchTerm,
  limitCount = 10,
) => {
  try {
    // Note: Firestore doesn't have native full-text search
    // This is a simple implementation that searches in multiple fields
    const results = [];

    for (const field of searchFields) {
      const constraints = [
        where(field, ">=", searchTerm),
        where(field, "<=", searchTerm + "\uf8ff"),
        limit(limitCount),
      ];

      const fieldResults = await getDocuments(collectionName, constraints);
      results.push(...fieldResults);
    }

    // Remove duplicates and limit results
    const uniqueResults = results.filter(
      (doc, index, self) => index === self.findIndex((d) => d.id === doc.id),
    );

    return uniqueResults.slice(0, limitCount);
  } catch (error) {
    console.error(`Error searching documents in ${collectionName}:`, error);
    throw error;
  }
};

// Helper function to get document count
export const getDocumentCount = async (
  collectionName,
  field = null,
  operator = null,
  value = null,
) => {
  try {
    let q = collection(db, collectionName);

    if (field && operator && value) {
      q = query(q, where(field, operator, value));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error(
      `Error getting document count from ${collectionName}:`,
      error,
    );
    throw error;
  }
};
