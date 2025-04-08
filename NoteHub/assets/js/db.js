'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { generateID, findNotebook, findNotebookIndex, findNote, findNoteIndex } from "./utility.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB4rEQ0pRWqYhjNazBT_sROL5xuE0cpvA",
  authDomain: "notehub-11f23.firebaseapp.com",
  projectId: "notehub-11f23",
  storageBucket: "notehub-11f23.firebasestorage.app",
  messagingSenderId: "162358168506",
  appId: "1:162358168506:web:35799f8d04ad29e341eb83",
  measurementId: "G-Y4VJ80PR1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

// Helper function to get current user ID
const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};

export const dbOperations = {
  post: {
    async notebook(name) {
      const userId = getCurrentUserId();
      const notebookData = {
        id: generateID(),
        name,
        userId,
        createdAt: new Date(),
        notes: []
      };

      await setDoc(doc(firestore, 'notebooks', notebookData.id), notebookData);
      return notebookData;
    },

    async note(notebookId, object) {
      const noteData = {
        id: generateID(),
        notebookId,
        ...object,
        userId: getCurrentUserId(),
        postedOn: Date.now()
      };

      await setDoc(doc(firestore, 'notes', noteData.id), noteData);
      return noteData;
    }
  },

  get: {
    async notebook() {
      const userId = getCurrentUserId();
      const notebooksRef = collection(firestore, 'notebooks');
      const q = query(notebooksRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data());
    },

    async note(notebookId) {
      const userId = getCurrentUserId();
      const notesRef = collection(firestore, 'notes');
      const q = query(notesRef, 
        where("userId", "==", userId),
        where("notebookId", "==", notebookId)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data());
    }
  },

  update: {
    async notebook(notebookId, name) {
      try {
        if (!notebookId) {
          throw new Error('Notebook ID is required');
        }
        
        const notebookRef = doc(firestore, 'notebooks', notebookId);
        
        // First check if notebook exists
        const notebookDoc = await getDoc(notebookRef);
        if (!notebookDoc.exists()) {
          throw new Error('Notebook not found');
        }
        
        const updatedData = {
          ...notebookDoc.data(),
          name: name || 'Untitled',
          updatedAt: Date.now()
        };
        
        await updateDoc(notebookRef, {
          name: updatedData.name,
          updatedAt: updatedData.updatedAt
        });
        
        return updatedData;
      } catch (error) {
        console.error('Error updating notebook:', error);
        throw error;
      }
    },

    async note(noteId, object) {
      const noteRef = doc(firestore, 'notes', noteId);
      
      try {
        // First get the existing note
        const existingNote = await getDoc(noteRef);
        if (!existingNote.exists()) {
          throw new Error('Note not found');
        }

        const existingData = existingNote.data();
        
        // Create updated data ensuring all required fields are present
        const updatedData = {
          id: noteId,
          notebookId: existingData.notebookId,
          userId: existingData.userId,
          title: object.title || existingData.title,
          content: object.content || existingData.content,
          postedOn: existingData.postedOn,
          updatedAt: new Date()
        };
        
        // Update only the changed fields
        await updateDoc(noteRef, {
          title: updatedData.title,
          content: updatedData.content,
          updatedAt: updatedData.updatedAt
        });
        
        // Return the complete updated data
        return updatedData;
      } catch (error) {
        console.error('Database update error:', error);
        throw error; // Re-throw to handle in the UI
      }
    }
  },

  delete: {
    async notebook(notebookId) {
      // Delete the notebook
      await deleteDoc(doc(firestore, 'notebooks', notebookId));
      
      // Delete all associated notes
      const notesRef = collection(firestore, 'notes');
      const q = query(notesRef, where("notebookId", "==", notebookId));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
    },

    async note(notebookId, noteId) {
      try {
        // Delete the note
        await deleteDoc(doc(firestore, 'notes', noteId));
        
        // Get remaining notes for this notebook
        const notesRef = collection(firestore, 'notes');
        const q = query(notesRef, 
          where("notebookId", "==", notebookId),
          where("userId", "==", getCurrentUserId())
        );
        const querySnapshot = await getDocs(q);
        
        // Return the remaining notes data
        return querySnapshot.docs.map(doc => doc.data());
      } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
      }
    }
  }
};

export const db = {
  ...dbOperations,
  init: async function() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};