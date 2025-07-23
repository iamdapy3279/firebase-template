import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useIsMounted } from '../hooks/useIsMounted';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useIsMounted();

  const clearError = () => setError(null);

  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);
    
    if (!snapshot.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();
      
      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData.displayName || '',
          email,
          photoURL: photoURL || '',
          createdAt,
          lastLoginAt: createdAt,
          preferences: {
            theme: 'light',
            notifications: true,
          },
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    } else {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        lastLoginAt: new Date()
      }, { merge: true });
    }
    
    return userRef;
  };

  const signUp = async (email, password, displayName = '') => {
    try {
      setError(null);
      setLoading(true);
      
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      await sendEmailVerification(user);
      await createUserProfile(user, { displayName });
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await createUserProfile(user);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setError(null);
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await createUserProfile(user);
        }
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setUser(user);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        if (isMountedRef.current) {
          setError(error.message);
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, [isMountedRef]);

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    logout,
    resetPassword,
    resendVerificationEmail,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};