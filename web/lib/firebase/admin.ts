import "server-only";

import {
  applicationDefault,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";

import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getFirebaseAdminApp(): App {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is not configured.");
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}