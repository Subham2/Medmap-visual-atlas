import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import appletConfig from '../../firebase-applet-config.json';

/**
 * Firebase web config is a public client identifier, not a secret. Access is
 * enforced by firestore.rules and by restricting the API key (HTTP referrers)
 * in Google Cloud Console. VITE_FIREBASE_* variables override the JSON file so
 * each deployment can point at its own project.
 */
const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || appletConfig.appId,
};

const firestoreDatabaseId: string | undefined =
  env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || undefined;

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
/**
 * Firestore (mind-map persistence, see firebase-blueprint.json and firestore.rules) is
 * loaded on first use. That keeps ~300 KB out of the initial bundle for sessions that never save.
 */
let dbPromise: Promise<import('firebase/firestore').Firestore> | null = null;
export function getDb() {
  dbPromise ??= import('firebase/firestore').then(({ getFirestore }) =>
    firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app),
  );
  return dbPromise;
}
