// src/hooks/useCrops.ts
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { CROP_DATABASE } from "@/utils/crop-database";
export const useCrops = () => {
    const [crops, setCrops] = useState(CROP_DATABASE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'YOUR_PROJECT_ID') {
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        const unsub = onSnapshot(collection(db, "crops"), (snap) => {
            if (!snap.empty) {
                const data = {};
                snap.forEach((doc) => (data[doc.id] = doc.data()));
                setCrops(data);
            }
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });
        return () => unsub();
    }, []);
    return { crops, loading, error };
};
