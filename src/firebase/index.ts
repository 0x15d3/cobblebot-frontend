import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { getAuth, /* setPersistence, browserSessionPersistence */} from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { fetchAndActivate, getRemoteConfig } from 'firebase/remote-config';

let firebaseInstance: firebase.FirebaseApp;

export async function initializeFirebase() {
  if (undefined === firebaseInstance) {
    const firebaseConfig = {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId,
    };
    firebaseInstance = firebase.initializeApp(firebaseConfig);
    fetchAndActivate(getConfig());
    //const auth = getAuthService();
    //await setPersistence(auth, browserSessionPersistence);
  }
}

export const getFirebaseApp = () => firebaseInstance;
export const getConfig = () => getRemoteConfig(firebaseInstance);
export const getAuthService = () => getAuth(firebaseInstance);
export const getFirestoreService = () => getFirestore(firebaseInstance);
export const getFunction = () => getFunctions(firebaseInstance);
export const getAnalytic = () => getAnalytics(firebaseInstance);
