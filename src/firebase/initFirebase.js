// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Helper to safely get and trim env vars (trailing newlines cause Firebase 400 INVALID_ARGUMENT)
const env = (key) => (process.env[key] || '').trim();

// Check if required environment variables are present
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_FIREBASE_MEASUREMENT_ID'
];

const missingEnvVars = requiredEnvVars.filter(varName => !env(varName));
if (missingEnvVars.length > 0) {
  console.error('Missing required Firebase configuration environment variables:', missingEnvVars);
  throw new Error('Missing required Firebase configuration environment variables');
}

// Your web app's Firebase configuration (values trimmed to avoid 400 from trailing newlines)
// measurementId omitted when empty - Firebase fetches from server to avoid mismatch warnings
const firebaseConfig = {
  apiKey: env('REACT_APP_FIREBASE_API_KEY'),
  authDomain: env('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: env('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: env('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('REACT_APP_FIREBASE_APP_ID'),
  measurementId: env('REACT_APP_FIREBASE_MEASUREMENT_ID') || undefined,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const firebaseAuth = getAuth(app);
const analytics = getAnalytics(app);

// Set persistence to LOCAL (persists even after browser is closed)
setPersistence(firebaseAuth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Save stock data to Firestore
export const saveStockDataToFirestore = async (symbol, data) => {
  try {
    await setDoc(doc(db, "Stock Market Data", symbol), {
      data,
      lastUpdated: new Date(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving stock data to Firestore", error);
    throw error;
  }
};

// Fetch stock data from Firestore
export const fetchStockDataFromFirestore = async (symbol) => {
  try {
    const docRef = doc(db, "Stock Market Data", symbol);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching stock data from Firestore", error);
    throw error;
  }
};

// Check if today's data is already fetched
export const isDataFetchedForToday = async (symbol) => {
  const today = new Date().toISOString().split("T")[0];
  const data = await fetchStockDataFromFirestore(symbol);
  if (data && data.lastUpdated) {
    const lastUpdated = data.lastUpdated.toDate().toISOString().split("T")[0];
    return today === lastUpdated;
  }
  return false;
};

// Analytics helper functions
const logAnalyticsEvent = (eventName, eventParams = {}) => {
  try {
    logEvent(analytics, eventName, {
      timestamp: new Date().toISOString(),
      ...eventParams
    });
    console.log('Analytics event logged:', eventName, eventParams);
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

// Common analytics events
export const analyticsEvents = {
  // Auth events
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  REGISTER: 'user_register',
  
  // Feature usage
  FEATURE_VIEW: 'feature_view',
  FEATURE_INTERACTION: 'feature_interaction',
  
  // Admin events
  ADMIN_ACCESS: 'admin_access',
  ADMIN_ACTION: 'admin_action',
  
  // Error events
  ERROR_OCCURRED: 'error_occurred',
  
  // Navigation events
  PAGE_VIEW: 'page_view',
  
  // Tool usage
  TOOL_START: 'tool_start',
  TOOL_COMPLETE: 'tool_complete'
};

// Export the Firebase app instance and other services
export { app, db, firebaseAuth, analytics, logAnalyticsEvent }; 