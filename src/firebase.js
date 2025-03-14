import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to check if a user is an admin
export const checkAdminStatus = async (uid) => {
  try {
    console.log('Checking admin status for UID:', uid);
    const adminDocRef = doc(db, 'admins', uid);
    const adminDoc = await getDoc(adminDocRef);
    const data = adminDoc.data();
    console.log('Admin doc exists:', adminDoc.exists());
    console.log('Admin doc data:', data);
    // Check if admin is either boolean true or string 'true'
    const isAdmin = adminDoc.exists() && 
                   (data.admin === true || data.admin === 'true') && 
                   data.adminId === uid;
    console.log('Is admin:', isAdmin);
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Function to get user's custom claims
export const getCustomClaims = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    const isAdmin = await checkAdminStatus(user.uid);
    return { admin: isAdmin };
  } catch (error) {
    console.error('Error getting custom claims:', error);
    return null;
  }
};

export { db, auth, provider };

export default app;
