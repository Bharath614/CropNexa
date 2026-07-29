// src/hooks/useCollection.ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, FirestoreError } from 'firebase/firestore';
import { db } from '@/utils/firebase';

/**
 * Generic hook to subscribe to a Firestore collection in real‑time.
 * Returns the typed documents (including the document ID as `id`), a loading flag, and any error message.
 */
export const useCollection = <T extends { id?: string }>(path: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent connecting if Firebase isn't properly configured yet
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'YOUR_PROJECT_ID') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const colRef = collection(db, path);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<T, 'id'>) } as T));
        setData(items);
        setLoading(false);
      },
      (e: FirestoreError) => {
        setError(e.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
};
