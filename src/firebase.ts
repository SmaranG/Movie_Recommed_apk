import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getDatabase } from "firebase/database";

// Safely load firebase-applet-config.json if it exists (avoids hard build-time crash in VS Code if file is absent)
const configFiles = import.meta.glob("../firebase-applet-config.json", { eager: true });
const firebaseAppletConfig: any = (configFiles["../firebase-applet-config.json"] as any)?.default || {};

// Check if user is overriding with their own custom project (e.g. locally in VS Code)
const isCustomOverride = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Dynamic configuration supporting both Google AI Studio (json) and VS Code/Local .env overrides
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || firebaseAppletConfig.databaseURL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Database ID fallback logic:
const customDbId = isCustomOverride
  ? import.meta.env.VITE_FIREBASE_DATABASE_ID
  : (import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId);

// Console logging to help debug local VS Code connectivity or configuration issues
if (import.meta.env.DEV) {
  console.log("=== Firebase Client Initialization ===");
  console.log("Project ID:", firebaseConfig.projectId || "MISSING");
  console.log("Database ID:", customDbId || "(default)");
  console.log("Auth Domain:", firebaseConfig.authDomain || "MISSING");
  console.log("Has API Key:", !!firebaseConfig.apiKey);
  console.log("Local Override Active:", isCustomOverride);
  console.log("========================================");
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
    console.error("WARNING: Firebase credentials are missing. Please make sure to copy .env.example to .env and set your credentials in VS Code!");
  }
}

export const db = (customDbId && customDbId.trim() !== "" && customDbId !== "(default)" && customDbId !== "remixed-firestore-database-id")
  ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true }, customDbId)
  : initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

export const auth = getAuth(app);
export const realtimeDb = getDatabase(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(errorMessage);
}

/**
 * Checks if a username is unique (i.e. does not exist in /usernames/{username})
 */
export async function isUsernameUnique(username: string): Promise<boolean> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) return false;
  const path = `usernames/${cleanUsername}`;

  try {
    const docRef = doc(db, "usernames", cleanUsername);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return false;
  }
}

/**
 * Registers a user profile in Firestore and reserves their unique username.
 */
export async function registerUserProfile(
  uid: string, 
  email: string, 
  username: string, 
  firstName: string, 
  lastName: string
) {
  const cleanUsername = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();
  const isOwnerAdmin = cleanEmail === "smarangamal2023@gmail.com" || cleanEmail.startsWith("admin@") || cleanEmail.includes("admin");

  const usernamePath = `usernames/${cleanUsername}`;
  const userPath = `users/${uid}`;

  const userProfile = {
    uid,
    email: cleanEmail,
    username: username.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    role: isOwnerAdmin ? "admin" : "user",
    selectedGenres: [],
    favorites: [],
    watchlist: [],
    watchHistory: [],
    searchHistory: [],
    ratings: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    // 1. Reserve username
    const usernameDocRef = doc(db, "usernames", cleanUsername);
    await setDoc(usernameDocRef, {
      uid,
      email: cleanEmail,
      createdAt: new Date().toISOString()
    });

    // 2. Create the user profile
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, userProfile);
    
    console.log(`Successfully registered user profile for UID: ${uid} (Username: ${username.trim()})`);
    return userProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${usernamePath} or ${userPath}`);
    throw error;
  }
}

/**
 * Loads a user profile by UID
 */
export async function loadUserProfileFromFirestore(uid: string): Promise<any | null> {
  const path = `users/${uid}`;

  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Saves or merges a user profile to Firestore by UID
 */
export async function saveUserProfileToFirestore(uid: string, profileData: any) {
  const path = `users/${uid}`;

  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`Successfully saved user profile to Firestore for UID: ${uid}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Updates a single field in a user profile document
 */
export async function updateUserFieldInFirestore(uid: string, fieldName: string, value: any) {
  const path = `users/${uid}`;

  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      [fieldName]: value,
      updatedAt: new Date().toISOString()
    });
    console.log(`Successfully updated field ${fieldName} in Firestore for UID: ${uid}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Deletes a user profile and frees up their registered username.
 */
export async function deleteUserProfileFromFirestore(uid: string) {
  const userPath = `users/${uid}`;

  try {
    const profile = await loadUserProfileFromFirestore(uid);
    if (profile && profile.username) {
      const cleanUsername = profile.username.trim().toLowerCase();
      const usernameDocRef = doc(db, "usernames", cleanUsername);
      await deleteDoc(usernameDocRef);
      console.log(`Successfully released username reservation: ${cleanUsername}`);
    }

    const userDocRef = doc(db, "users", uid);
    await deleteDoc(userDocRef);
    console.log(`Successfully deleted user profile for UID: ${uid}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, userPath);
  }
}

/**
 * Synchronizes/Seeds beautiful, realistic pre-registered user profiles in Firestore
 * if the users collection is empty or has fewer than 2 profiles.
 */
export async function syncAllUsersWithFirestore(): Promise<Record<string, any>> {
  try {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    
    // If we already have user records, do not overwrite them
    if (snapshot.size >= 2) {
      const existing: Record<string, any> = {};
      snapshot.forEach((doc) => {
        existing[doc.id] = doc.data();
      });
      return existing;
    }

    // Pre-registered mock users data
    const preRegisteredUsers = [
      {
        uid: "sarah_connor_demo_uid",
        email: "sarah.connor@cinematch.io",
        username: "sarah_terminator",
        firstName: "Sarah",
        lastName: "Connor",
        role: "user",
        selectedGenres: ["Action", "Sci-Fi", "Thriller"],
        favorites: ["The Matrix", "Inception", "Interstellar"],
        watchlist: ["The Dark Knight", "Forrest Gump"],
        ratings: { "The Matrix": 10, "Inception": 9, "Interstellar": 9 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        uid: "james_cole_demo_uid",
        email: "james.cole@cinematch.io",
        username: "time_traveler",
        firstName: "James",
        lastName: "Cole",
        role: "user",
        selectedGenres: ["Sci-Fi", "Mystery", "Drama"],
        favorites: ["Twelve Monkeys", "Inception"],
        watchlist: ["The Matrix", "Fight Club"],
        ratings: { "Twelve Monkeys": 10, "Inception": 8, "Fight Club": 9 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        uid: "elena_gilbert_demo_uid",
        email: "elena.gilbert@cinematch.io",
        username: "mystic_reads",
        firstName: "Elena",
        lastName: "Gilbert",
        role: "user",
        selectedGenres: ["Romance", "Drama"],
        favorites: ["The Notebook", "Titanic"],
        watchlist: ["Forrest Gump", "La La Land"],
        ratings: { "The Notebook": 10, "Titanic": 9, "La La Land": 8 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        uid: "michael_scott_demo_uid",
        email: "michael.scott@cinematch.io",
        username: "threat_level_midnight",
        firstName: "Michael",
        lastName: "Scott",
        role: "user",
        selectedGenres: ["Comedy", "Romance"],
        favorites: ["Dumb and Dumber", "Forrest Gump"],
        watchlist: ["The Matrix"],
        ratings: { "Dumb and Dumber": 10, "Forrest Gump": 9 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        uid: "sherlock_holmes_demo_uid",
        email: "sherlock.holmes@cinematch.io",
        username: "consulting_detective",
        firstName: "Sherlock",
        lastName: "Holmes",
        role: "admin",
        selectedGenres: ["Mystery", "Thriller"],
        favorites: ["The Dark Knight", "Inception"],
        watchlist: ["Twelve Monkeys"],
        ratings: { "The Dark Knight": 10, "Inception": 9 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const seeded: Record<string, any> = {};

    for (const u of preRegisteredUsers) {
      // Create user profile
      const userDocRef = doc(db, "users", u.uid);
      await setDoc(userDocRef, u);

      // Reserve username
      const usernameDocRef = doc(db, "usernames", u.username);
      await setDoc(usernameDocRef, {
        uid: u.uid,
        email: u.email,
        createdAt: new Date().toISOString()
      });

      seeded[u.uid] = u;
    }

    console.log("Successfully seeded pre-registered demo users into Firestore.");
    return seeded;
  } catch (error) {
    console.error("Failed to seed pre-registered users:", error);
    return {};
  }
}
