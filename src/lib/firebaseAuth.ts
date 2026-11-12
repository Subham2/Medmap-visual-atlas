import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Scopes:
 * - spreadsheets: append simulation rows.
 * - drive.file:   find/create only spreadsheets this app created (no broad Drive access).
 */
const SHEETS_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

// Google OAuth access tokens live for 3600 s. Keep a margin so a token never expires mid-request.
const TOKEN_TTL_MS = 55 * 60 * 1000;
const TOKEN_KEY = 'medmap_sheets_token';

interface StoredToken {
  token: string;
  uid: string;
  expiresAt: number;
}

// sessionStorage (not localStorage): the token dies with the tab and is never shared across tabs.
function readToken(uid: string): string | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed: StoredToken = JSON.parse(raw);
    if (parsed.uid !== uid || Date.now() >= parsed.expiresAt) {
      sessionStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
}

function writeToken(uid: string, token: string) {
  try {
    const value: StoredToken = { token, uid, expiresAt: Date.now() + TOKEN_TTL_MS };
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — token stays in memory only */
  }
}

function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Subscribe to auth state. onSignedIn fires only when a user AND a still-valid
 * Sheets token exist; otherwise the user must click "Sign in" again to grant scopes.
 * Returns the unsubscribe function.
 */
export function initAuth(
  onSignedIn: (user: User, accessToken: string) => void,
  onSignedOut: () => void,
): () => void {
  try {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        clearToken();
        onSignedOut();
        return;
      }
      const token = readToken(user.uid);
      if (token) onSignedIn(user, token);
      else onSignedOut();
    });
  } catch (err) {
    console.warn('[Auth] Firebase auth unavailable; Sheets sync disabled.', err);
    onSignedOut();
    return () => {};
  }
}

export async function googleSignIn(): Promise<{ user: User; accessToken: string } | null> {
  const provider = new GoogleAuthProvider();
  SHEETS_SCOPES.forEach((s) => provider.addScope(s));
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    if (!accessToken) throw new Error('Google did not return an access token for Sheets.');
    writeToken(result.user.uid, accessToken);
    return { user: result.user, accessToken };
  } catch (err: any) {
    // The user closing the popup is not an error worth surfacing.
    if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
      return null;
    }
    if (err?.code === 'auth/unauthorized-domain') {
      throw new Error(
        `This domain (${window.location.hostname}) is not authorised in Firebase Auth. Add it under Authentication → Settings → Authorized domains.`,
      );
    }
    throw err;
  }
}

export async function googleSignOut(): Promise<void> {
  clearToken();
  await signOut(auth);
}
