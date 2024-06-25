import { useMemo } from 'react';
import { getFirestore } from 'firebase/firestore';
import { useFirebaseApp } from 'reactfire';

export const useMyFirestore = () => {
  const firebaseApp = useFirebaseApp();
  return useMemo(() => getFirestore(firebaseApp), [firebaseApp]);
};
