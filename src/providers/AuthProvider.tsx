import React, { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { setUser } from '@/store/slices/authSlice';
import { auth, isFirebaseConfigured } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '@/services/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Firebase not configured, set user to null
      dispatch(setUser(null));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const user = await AuthService.getUserProfile(firebaseUser.uid);
          dispatch(setUser(user));
        } catch (error) {
          console.error('Error loading user profile:', error);
          // If profile doesn't exist, create it
          try {
            const user = await AuthService.createOrUpdateUserProfile(firebaseUser);
            dispatch(setUser(user));
          } catch (createError) {
            console.error('Error creating user profile:', createError);
            dispatch(setUser(null));
          }
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};
