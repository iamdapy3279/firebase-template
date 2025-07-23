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

  const clearError = () => setError(null);

  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;
    
    console.log('CreateUserProfile: Starting for user:', user.uid);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      console.log('CreateUserProfile: Got user reference');
      
      const snapshot = await getDoc(userRef);
      console.log('CreateUserProfile: Got user document, exists:', snapshot.exists());
      
      if (!snapshot.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();
        
        console.log('CreateUserProfile: Creating new user profile...');
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
        console.log('CreateUserProfile: New profile created successfully');
      } else {
        console.log('CreateUserProfile: Updating existing profile...');
        await setDoc(userRef, {
          lastLoginAt: new Date()
        }, { merge: true });
        console.log('CreateUserProfile: Profile updated successfully');
      }
      
      return userRef;
    } catch (error) {
      console.error('CreateUserProfile: Error occurred:', error);
      throw error;
    }
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
      
      console.log('SignIn: Starting authentication...');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log('SignIn: Authentication successful, user:', user.uid);
      
      console.log('SignIn: Creating/updating user profile...');
      await createUserProfile(user);
      console.log('SignIn: User profile updated successfully');
      
      return user;
    } catch (error) {
      console.error('SignIn: Error occurred:', error);
      setError(error.message);
      throw error;
    } finally {
      console.log('SignIn: Setting loading to false');
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
    console.log('AuthContext: Setting up onAuthStateChanged listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthContext: Auth state changed, user:', user ? user.uid : 'null');
      
      try {
        if (user) {
          console.log('AuthContext: User found, creating/updating profile...');
          await createUserProfile(user);
          console.log('AuthContext: Profile update complete');
        } else {
          console.log('AuthContext: No user found');
        }
        
        console.log('AuthContext: Updating state...');
        setUser(user);
        setLoading(false);
        console.log('AuthContext: State updated - user:', user ? 'authenticated' : 'not authenticated', 'loading: false');
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

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