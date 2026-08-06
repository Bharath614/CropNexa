import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchCrops() {
  console.log("Fetching crops...");
  const querySnapshot = await getDocs(collection(db, "crops"));
  const crops = [];
  querySnapshot.forEach((doc) => {
    crops.push({ id: doc.id, ...doc.data() });
  });
  console.log(`Found ${crops.length} crops:`);
  console.log(JSON.stringify(crops, null, 2));
  process.exit(0);
}

fetchCrops().catch((err) => {
  console.error("Error fetching crops:", err);
  process.exit(1);
});
