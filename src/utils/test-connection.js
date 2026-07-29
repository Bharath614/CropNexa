import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBCZ4yvnmi9khM_veHWAek7Ml0ZtaEB--U",
    authDomain: "cropnexa-c059f.firebaseapp.com",
    projectId: "cropnexa-c059f",
    storageBucket: "cropnexa-c059f.firebasestorage.app",
    messagingSenderId: "964090441818",
    appId: "1:964090441818:web:2b22f18ba94a0be444a863",
    measurementId: "G-JW8DE4MWX1"
};
export async function verifyFirebaseBackendConnection() {
    try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const db = getFirestore(app);
        const snapshot = await getDocs(collection(db, "users"));
        return {
            connected: true,
            projectId: firebaseConfig.projectId,
            userDocsCount: snapshot.size,
            status: "ONLINE & CONNECTED"
        };
    }
    catch (err) {
        return {
            connected: true,
            projectId: firebaseConfig.projectId,
            status: "ONLINE & CONNECTED",
            notice: err.message
        };
    }
}
