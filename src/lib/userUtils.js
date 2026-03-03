import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Creates a User document in Users collection if it doesn't exist.
 * All user data (profile, login streak) lives in Users/{uid}.
 * @param {object} db - Firestore instance
 * @param {object} firebaseUser - Firebase Auth user (has uid, email, displayName)
 * @param {object} overrides - Optional fields to override (e.g. { email } for email/password signup)
 * @returns {Promise<boolean>} - true if a new user doc was created
 */
export async function ensureUserDoc(db, firebaseUser, overrides = {}) {
  const userRef = doc(db, 'Users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const displayName = firebaseUser.displayName || '';
    const nameParts = displayName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const currentDate = new Date().toISOString();

    const userData = {
      email: firebaseUser.email || overrides.email || '',
      firstName: overrides.firstName ?? firstName,
      lastName: overrides.lastName ?? lastName,
      user: true,
      admin: false,
      developer: false,
      isActive: true,
      userUID: firebaseUser.uid,
      role: 'user',
      createdAt: currentDate,
      lastLogin: currentDate,
      streak: 1,
      ...overrides,
    };

    await setDoc(userRef, userData);
    return true;
  }
  return false;
}

/**
 * Updates login streak in Users/{uid}. Call on each login.
 */
export async function updateLoginStreak(db, userId) {
  const userRef = doc(db, 'Users', userId);
  const snap = await getDoc(userRef);
  const now = new Date();
  const currentDate = now.toISOString();

  if (snap.exists()) {
    const { lastLogin, streak } = snap.data();
    const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDay = lastLoginDate ? new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate()) : null;
    const daysDiff = lastDay ? Math.floor((today.getTime() - lastDay.getTime()) / (1000 * 3600 * 24)) : 999;

    const newStreak = daysDiff === 1 ? (streak || 0) + 1 : daysDiff === 0 ? (streak || 0) : 1;
    await setDoc(userRef, { lastLogin: currentDate, streak: newStreak }, { merge: true });
  }
}
