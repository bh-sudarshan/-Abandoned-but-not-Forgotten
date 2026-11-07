import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId as second argument
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling per Firebase Skill Requirement
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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or network restricted.");
    }
    return false;
  }
}

// Type Definitions
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalObjectsFound: number;
  moonObjectsFound: number;
  marsObjectsFound: number;
  highScore: number;
  moonScore: number;
  marsScore: number;
  favoriteVehicle?: string;
  soundEnabled?: boolean;
  speedMode?: string;
  createdAt?: string;
  updatedAt?: string;
  isAdmin?: boolean;
}

export interface UserDiscovery {
  id?: string;
  userId: string;
  objectId: string;
  objectName: string;
  targetBody: 'MOON' | 'MARS';
  points: number;
  coordinates: string;
  roverUsed: string;
  foundAt: string;
  // enriched fields for rich card UI
  dates?: string;
  discovery?: string;
  status?: string;
  imageUrl?: string;
}

export interface AbandonedObjectItem {
  id: string;
  name: string;
  targetBody: 'MOON' | 'MARS';
  body: string;
  dates: string;
  discovery: string;
  status: string;
  points: number;
  imageUrl?: string;
  blueprintType?: string;
  createdAt?: string;
}

export interface VehicleItem {
  id: string;
  name: string;
  fullName: string;
  destination: 'MOON' | 'MARS';
  type: string;
  site: string;
  massSpeed: string;
  power: string;
  payload: string;
  record: string;
  status: string;
  telemetryKey: string;
  accent?: string;
  isAvailable?: boolean;
}

// Admin bootstrap constant
export const BOOTSTRAP_ADMIN_EMAIL = 'bhsudarshan0@gmail.com';

export function checkIsAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
}

// Auth API
export async function loginWithGoogle(): Promise<User> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user);
    return cred.user;
  } catch (error) {
    console.error("Login with Google error:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Sync user profile upon sign in
export async function syncUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    const isAdmin = checkIsAdmin(user);
    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Space Explorer',
        email: user.email || '',
        photoURL: user.photoURL || '',
        totalObjectsFound: 0,
        moonObjectsFound: 0,
        marsObjectsFound: 0,
        highScore: 0,
        moonScore: 0,
        marsScore: 0,
        favoriteVehicle: 'VIPER',
        soundEnabled: true,
        speedMode: '1X',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAdmin,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const data = snap.data() as UserProfile;
      const updated: Partial<UserProfile> = {
        displayName: user.displayName || data.displayName,
        photoURL: user.photoURL || data.photoURL,
        updatedAt: new Date().toISOString(),
        isAdmin: isAdmin || data.isAdmin || false
      };
      await updateDoc(userRef, updated);
      return { ...data, ...updated };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

// Update User Settings
export async function updateUserSettings(
  uid: string,
  settings: {
    displayName?: string;
    favoriteVehicle?: string;
    soundEnabled?: boolean;
    speedMode?: string;
  }
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

// Record an Abandoned Object Discovery
export async function recordDiscovery(
  user: User,
  discovery: Omit<UserDiscovery, 'userId' | 'foundAt'>
): Promise<void> {
  const userDocRef = doc(db, 'users', user.uid);
  const discoveryDocId = `${discovery.targetBody.toLowerCase()}_${discovery.objectId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  const discoveryDocRef = doc(db, 'users', user.uid, 'discoveries', discoveryDocId);

  try {
    const existingSnap = await getDoc(discoveryDocRef);
    const isNewUniqueDiscovery = !existingSnap.exists();

    const fullDiscovery: UserDiscovery = {
      ...discovery,
      userId: user.uid,
      foundAt: new Date().toISOString()
    };

    await setDoc(discoveryDocRef, fullDiscovery, { merge: true });

    // Update user discovery counts if new
    if (isNewUniqueDiscovery) {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const udata = userSnap.data() as UserProfile;
        const isMoon = discovery.targetBody === 'MOON';
        await updateDoc(userDocRef, {
          totalObjectsFound: (udata.totalObjectsFound || 0) + 1,
          moonObjectsFound: (udata.moonObjectsFound || 0) + (isMoon ? 1 : 0),
          marsObjectsFound: (udata.marsObjectsFound || 0) + (!isMoon ? 1 : 0),
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/discoveries/${discoveryDocId}`);
  }
}

// Update High Score on Game Over / Run
export async function recordHighScore(
  user: User,
  score: number,
  surface: 'MOON' | 'MARS'
): Promise<void> {
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) return;
    const udata = userSnap.data() as UserProfile;
    const currentHigh = udata.highScore || 0;
    const currentMoon = udata.moonScore || 0;
    const currentMars = udata.marsScore || 0;

    const updates: Partial<UserProfile> = {
      updatedAt: new Date().toISOString()
    };

    if (score > currentHigh) updates.highScore = score;
    if (surface === 'MOON' && score > currentMoon) updates.moonScore = score;
    if (surface === 'MARS' && score > currentMars) updates.marsScore = score;

    if (Object.keys(updates).length > 1) {
      await updateDoc(userDocRef, updates);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
  }
}

// Subscribe to User Discoveries
export function subscribeToUserDiscoveries(
  userId: string,
  onUpdate: (discoveries: UserDiscovery[]) => void
): Unsubscribe {
  const colRef = collection(db, 'users', userId, 'discoveries');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: UserDiscovery[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as UserDiscovery);
      });
      // Sort newest found first
      items.sort((a, b) => (new Date(b.foundAt).getTime() || 0) - (new Date(a.foundAt).getTime() || 0));
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/discoveries`);
    }
  );
}

// Subscribe to Global Leaderboard
export function subscribeToLeaderboard(
  category: 'all' | 'moon' | 'mars',
  onUpdate: (players: UserProfile[]) => void
): Unsubscribe {
  const usersRef = collection(db, 'users');
  return onSnapshot(
    usersRef,
    (snapshot) => {
      const players: UserProfile[] = [];
      snapshot.forEach(docSnap => {
        players.push(docSnap.data() as UserProfile);
      });

      // Sort based on category
      if (category === 'moon') {
        players.sort((a, b) => {
          if ((b.moonObjectsFound || 0) !== (a.moonObjectsFound || 0)) {
            return (b.moonObjectsFound || 0) - (a.moonObjectsFound || 0);
          }
          return (b.moonScore || 0) - (a.moonScore || 0);
        });
      } else if (category === 'mars') {
        players.sort((a, b) => {
          if ((b.marsObjectsFound || 0) !== (a.marsObjectsFound || 0)) {
            return (b.marsObjectsFound || 0) - (a.marsObjectsFound || 0);
          }
          return (b.marsScore || 0) - (a.marsScore || 0);
        });
      } else {
        // Together / Overall
        players.sort((a, b) => {
          if ((b.totalObjectsFound || 0) !== (a.totalObjectsFound || 0)) {
            return (b.totalObjectsFound || 0) - (a.totalObjectsFound || 0);
          }
          return (b.highScore || 0) - (a.highScore || 0);
        });
      }

      onUpdate(players.slice(0, 50));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    }
  );
}

// Subscribe to Master Abandoned Objects Catalog
export function subscribeToAbandonedObjects(
  onUpdate: (objects: AbandonedObjectItem[]) => void
): Unsubscribe {
  const colRef = collection(db, 'abandoned_objects');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: AbandonedObjectItem[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as AbandonedObjectItem);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'abandoned_objects');
    }
  );
}

// Admin: Save or Update Abandoned Object
export async function saveAbandonedObject(obj: AbandonedObjectItem): Promise<void> {
  const cleanId = (obj.id || obj.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase());
  const docRef = doc(db, 'abandoned_objects', cleanId);
  try {
    await setDoc(docRef, {
      ...obj,
      id: cleanId,
      createdAt: obj.createdAt || new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `abandoned_objects/${cleanId}`);
  }
}

// Admin: Delete Abandoned Object
export async function removeAbandonedObject(id: string): Promise<void> {
  const docRef = doc(db, 'abandoned_objects', id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `abandoned_objects/${id}`);
  }
}

// Subscribe to Master Vehicles Catalog
export function subscribeToVehicles(
  onUpdate: (vehicles: VehicleItem[]) => void
): Unsubscribe {
  const colRef = collection(db, 'vehicles');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: VehicleItem[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as VehicleItem);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'vehicles');
    }
  );
}

// Admin: Save or Update Vehicle
export async function saveVehicle(vehicle: VehicleItem): Promise<void> {
  const cleanId = (vehicle.id || vehicle.name.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase());
  const docRef = doc(db, 'vehicles', cleanId);
  try {
    await setDoc(docRef, {
      ...vehicle,
      id: cleanId,
      isAvailable: vehicle.isAvailable !== false
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `vehicles/${cleanId}`);
  }
}

// Admin: Delete Vehicle
export async function removeVehicle(id: string): Promise<void> {
  const docRef = doc(db, 'vehicles', id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `vehicles/${id}`);
  }
}
