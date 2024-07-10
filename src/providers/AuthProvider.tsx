import React, { createContext, useEffect, useState, ReactNode } from 'react';
import FullPageLoading from '../components/page/pageloading';
import { setUserId } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, getIdTokenResult, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { getAnalytic } from '../firebase';

export interface UserState {
  uid: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  refreshToken: string;
  isAdmin?: boolean;
  isUser?: boolean;
}

interface IAuthContext {
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void> | undefined;
  userState: UserState | null;
}

export const AuthContext = createContext({} as IAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [authPending, setAuthPending] = useState(true);
  const auth = getAuth();

  const signIn = async (username: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
    } catch (error) {
      console.error(error);
    }
  };

  const signUp = async (username: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user as UserState;
      setUserId(getAnalytic(),user.uid);
      setUserState(user);
    } catch (error) {
      const authError = error as AuthError;
      console.error(authError);
    }
  };

  const signOutAsync = async (): Promise<void> => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const user = userAuth as UserState;
        setUserId(getAnalytic(),user.uid);

        await userAuth.getIdToken(true);
        getIdTokenResult(userAuth).then(({ claims }) => {
          user.isAdmin = claims?.admin ? Boolean(claims?.admin) : false;
          user.isUser = Boolean(claims?.user);
          setUserState(user);
          setAuthPending(false);
        });
      } else {
        setUserState(null);
        setAuthPending(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (authPending) {
    return <FullPageLoading />;
  }

  return (
    <AuthContext.Provider value={{
      signIn,
      signUp,
      signOut: signOutAsync,
      userState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
