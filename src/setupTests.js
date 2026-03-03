// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Firebase so tests run without env vars or real Firebase
jest.mock('./firebase/initFirebase', () => ({
  app: {},
  db: {},
  firebaseAuth: {},
  analytics: {},
  logAnalyticsEvent: jest.fn(),
  saveStockDataToFirestore: jest.fn(),
  fetchStockDataFromFirestore: jest.fn(),
  isDataFetchedForToday: jest.fn(),
  analyticsEvents: {},
}));

// Mock useAuth so tests don't need real Firebase Auth
jest.mock('./firebase/auth', () => ({
  useAuth: () => ({
    currentUser: null,
    loading: false,
    error: null,
    signIn: jest.fn(),
    signOut: jest.fn(),
    register: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInWithApple: jest.fn(),
  }),
}));
