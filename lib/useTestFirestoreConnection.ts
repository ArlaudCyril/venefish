import { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useMyFirestore } from './useMyFirestore';

const useTestFirestoreConnection = () => {
  const firestore = useMyFirestore();

  useEffect(() => {
    const testFirestoreConnection = async () => {
      try {
        await setDoc(doc(firestore, 'testCollection', 'testDoc'), {
          testField: 'testValue'
        });
        console.log('Test document created successfully in Firestore');
      } catch (err: any) {
        console.error('Error creating test document:', err);
      }
    };

    testFirestoreConnection();
  }, [firestore]);
};

export default useTestFirestoreConnection;
