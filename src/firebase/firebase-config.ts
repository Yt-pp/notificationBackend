import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json'; // Adjust the path as needed

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://test-for-push-notificati-4729d.firebaseio.com', // Your database URL
});

export const firebaseAdmin = admin;
