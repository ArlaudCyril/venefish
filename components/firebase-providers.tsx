"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  AnalyticsProvider,
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
} from "reactfire";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { isBrowser } from "@/lib/utils";
import { getAnalytics } from "firebase/analytics";
import { FirebaseOptions } from "firebase/app";

const config: FirebaseOptions = {
  apiKey: "AIzaSyA7nnCLOZlVVDzDWAajGCZVXxqyFf4M1vg",
  authDomain: "travel-postcards.firebaseapp.com",
  projectId: "travel-postcards",
  storageBucket: "travel-postcards.appspot.com",
  messagingSenderId: "875540562127",
  appId: "1:875540562127:web:f54adf57e310f2da7ab7ba",
  measurementId: "G-WRY6WNH759"
};

const FirebaseProviderSDKs: FC<{ children: ReactNode }> = ({ children }) => {
  const firebase = useFirebaseApp();
  // we have to use getters to pass to providers, children should use hooks
  const auth = useMemo(() => getAuth(), []);
  const firestore = useMemo(() => getFirestore(firebase), []);
  const analytics = useMemo(() => isBrowser() && getAnalytics(firebase), []);

  return (
    <>
      {auth && (
        <AuthProvider sdk={auth}>
          <FirestoreProvider sdk={firestore}>
            {/* we can only use analytics in the browser */}
            {analytics ? (
              <AnalyticsProvider sdk={analytics}>{children}</AnalyticsProvider>
            ) : (
              <>{children}</>
            )}
          </FirestoreProvider>
        </AuthProvider>
      )}
    </>
  );
};

export const MyFirebaseProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <FirebaseAppProvider firebaseConfig={config}>
        <FirebaseProviderSDKs>{children}</FirebaseProviderSDKs>
      </FirebaseAppProvider>
    </>
  );
};


