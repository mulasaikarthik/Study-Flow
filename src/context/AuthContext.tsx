import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { authService, mapAuthUser } from '../services/authService';
import { supabase } from '../lib/supabase';
import { keepSessionRefreshed } from '../utils/supabase/session';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (data: {
    fullName: string;
    email: string;
    password: string;
    university?: string;
    major?: string;
    academicYear?: string;
  }) => Promise<'authenticated' | 'confirm_email' | 'error'>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const currentUser = await authService.getSessionUser();
        if (isMounted) setUser(currentUser);
      } catch (err: unknown) {
        if (isMounted) {
          setUser(null);
          const message = err instanceof Error ? err.message : 'Could not restore your session.';
          showToast({
            type: 'error',
            title: 'Session Error',
            message,
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    restoreSession();

    const stopSessionRefresh = keepSessionRefreshed();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapAuthUser(session.user) : null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      stopSessionRefresh();
      subscription.unsubscribe();
    };
  }, [showToast]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      showToast({
        type: 'success',
        title: `Welcome back, ${loggedUser.fullName.split(' ')[0]}!`,
        message: 'Successfully logged in to StudyFlow.',
      });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message: msg,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUp = async (data: {
    fullName: string;
    email: string;
    password: string;
    university?: string;
    major?: string;
    academicYear?: string;
  }): Promise<'authenticated' | 'confirm_email' | 'error'> => {
    try {
      setIsSubmitting(true);
      const result = await authService.signUp(data);

      if (result.needsEmailConfirmation) {
        showToast({
          type: 'info',
          title: 'Confirm your email',
          message: 'Account created. Check your inbox to confirm, then sign in.',
        });
        return 'confirm_email';
      }

      if (!result.user) {
        showToast({
          type: 'error',
          title: 'Registration Error',
          message: 'Account was not created. Please try again.',
        });
        return 'error';
      }

      setUser(result.user);
      showToast({
        type: 'success',
        title: 'Account created!',
        message: `Welcome to StudyFlow, ${result.user.fullName}! Your student workspace is ready.`,
      });
      return 'authenticated';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create account.';
      showToast({
        type: 'error',
        title: 'Registration Error',
        message: msg,
      });
      return 'error';
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      await authService.logout();
      setUser(null);
      showToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been safely signed out.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not sign out.';
      showToast({
        type: 'error',
        title: 'Sign Out Failed',
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const updated = await authService.updateProfile(updates);
      setUser(updated);
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your student preferences and profile have been saved.',
      });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      showToast({
        type: 'error',
        title: 'Update Error',
        message: msg,
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isSubmitting,
        login,
        signUp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
