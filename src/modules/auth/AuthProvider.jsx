import React, { createContext, useState, useEffect, useRef } from 'react';
import { eventBus } from '@/modules/core/events/eventBus';
import { events } from '@/modules/auth/events';
import * as Sentry from '@sentry/browser';
import { authService } from './authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasSessionRef = useRef(false);

  // Use this function to update session so we also update our ref
  const updateSession = (newSession) => {
    setSession(newSession);
    hasSessionRef.current = newSession !== null;
  };

  useEffect(() => {
    // Check active session on initial mount
    const checkSession = async () => {
      try {
        const { data } = await authService.getSession();
        
        // Set initial session
        updateSession(data.session);
        if (data.session) {
          hasSessionRef.current = true;
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const authListener = authService.onAuthStateChange(async (event, newSession) => {
      console.log('Auth event:', event, 'Has session:', hasSessionRef.current);
      
      // For SIGNED_IN, only update session if we don't have one
      if (event === 'SIGNED_IN') {
        if (!hasSessionRef.current) {
          updateSession(newSession);
          if (newSession?.user?.email) {
            eventBus.publish(events.USER_SIGNED_IN, { user: newSession.user });
          }
        } else {
          console.log('Already have session, ignoring SIGNED_IN event');
        }
      }
      // For SIGNED_OUT, clear the session
      else if (event === 'SIGNED_OUT') {
        updateSession(null);
        eventBus.publish(events.USER_SIGNED_OUT, {});
      }
    });
    
    return () => {
      authListener?.data?.subscription?.unsubscribe();
    };
  }, []); 

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Sentry.captureException(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};