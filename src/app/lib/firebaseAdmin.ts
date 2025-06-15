import * as admin from 'firebase-admin';
import { FIREBASE_CONFIG } from "./constant";

if (!admin.apps.length) {
  admin.initializeApp(FIREBASE_CONFIG);
}

export const dbAdmin = admin.firestore();