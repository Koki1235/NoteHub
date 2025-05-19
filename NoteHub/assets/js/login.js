import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { generateID, findNotebook, findNotebookIndex, findNote, findNoteIndex } from "./utility.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjjcRCE-eF0yHsqOcuVIYHAOmZWwwTnPA",
  authDomain: "notehub-673db.firebaseapp.com",
  projectId: "notehub-673db",
  storageBucket: "notehub-673db.firebasestorage.app",
  messagingSenderId: "165257025630",
  appId: "1:165257025630:web:a169aa366941977fa53ccf",
  measurementId: "G-X71MJG0WKJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = firestore; // Add this line to use 'db' as an alias for firestore

// DOM Elements
let signInForm, signUpForm, forgotPasswordLink;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  signInForm = document.querySelector('.sign-in-form');
  signUpForm = document.querySelector('.sign-up-form');
  forgotPasswordLink = document.getElementById('forgot-password');

  // Add event listeners
  if (signUpForm) {
    signUpForm.addEventListener('submit', signUp);
  }

  if (signInForm) {
    signInForm.addEventListener('submit', signIn);
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
  }
});

// Form Validation Function
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required]');
  for (let input of inputs) {
    if (!input.value.trim()) {
      input.focus();
      return false;
    }
  }
  return true;
}

// Sign Up Function
async function signUp(e) {
  e.preventDefault();
  
  // Get form elements
  const usernameInput = document.getElementById('signup-username');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');

  // Validate inputs exist
  if (!usernameInput || !emailInput || !passwordInput) {
    alert('Please fill out all fields');
    return;
  }

  // Get input values
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validate form
  if (!validateForm(signUpForm)) {
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with username
    await updateProfile(user, {
      displayName: username
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: email,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    alert('Account created successfully! Please sign in.');
    
    // Reset the form and switch to sign-in view (assuming you have a toggle mechanism)
    const toggleLink = document.querySelector('.toggle');
    if (toggleLink) {
      toggleLink.click();
    }
  } catch (error) {
    console.error('Sign Up Error:', error);
    
    // Handle specific Firebase Auth errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        alert('Email is already registered. Please use a different email or try logging in.');
        break;
      case 'auth/invalid-email':
        alert('Invalid email address. Please check and try again.');
        break;
      case 'auth/weak-password':
        alert('Password is too weak. Please use a stronger password.');
        break;
      default:
        alert(`Error: ${error.message}`);
    }
  }
}

// Sign In Function
async function signIn(e) {
  e.preventDefault();
  
  // Get form elements
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  // Validate inputs exist
  if (!emailInput || !passwordInput) {
    alert('Please enter your email and password');
    return;
  }

  // Get input values
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validate form
  if (!validateForm(signInForm)) {
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date()
    }, { merge: true });

    alert('Sign in successful!');
    // Redirect to main page
    window.location.href = 'main.html';
  } catch (error) {
    console.error('Sign In Error:', error);
    
    // Handle specific Firebase Auth errors
    switch (error.code) {
      case 'auth/invalid-credential':
        alert('Invalid email or password. Please try again.');
        break;
      case 'auth/user-not-found':
        alert('No user found with this email. Please sign up.');
        break;
      case 'auth/wrong-password':
        alert('Incorrect password. Please try again.');
        break;
      default:
        alert(`Error: ${error.message}`);
    }
  }
}

// Forgot Password Function
async function handleForgotPassword(e) {
  e.preventDefault();
  
  // Get email input
  const emailInput = document.getElementById('login-email');
  
  // Validate email input exists
  if (!emailInput) {
    alert('Email input field is missing.');
    return;
  }

  const email = emailInput.value.trim();

  // Validate email is not empty
  if (!email) {
    emailInput.focus();
    alert('Please enter your email address.');
    return;
  }

  try {
    // Send password reset email
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent! Please check your inbox.');
  } catch (error) {
    console.error('Forgot Password Error:', error);
    
    // Handle specific Firebase Auth errors
    switch (error.code) {
      case 'auth/invalid-email':
        alert('The email address is invalid. Please check and try again.');
        break;
      case 'auth/user-not-found':
        alert('No user found with this email address.');
        break;
      default:
        alert(`An error occurred: ${error.message}`);
    }
  }
}

// Export functions for potential external use
export { 
  signUp, 
  signIn, 
  handleForgotPassword
};