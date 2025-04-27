import { db } from '@/indexedDb';
import * as Sentry from '@sentry/browser';

// Simulated authentication service using IndexedDB
export const authService = {
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User object
   */
  async register(email, password) {
    try {
      // Check if user already exists
      const existingUser = await db.queryByIndex(db.STORES.USERS, 'email', email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // In a real app, you would hash the password before storing
      // For demo purposes, we'll just store it directly (not secure!)
      const newUser = {
        email,
        password, // In production, this should be hashed!
        createdAt: new Date(),
      };
      
      const userId = await db.add(db.STORES.USERS, newUser);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return { ...userWithoutPassword, id: userId };
    } catch (error) {
      console.error('Registration error:', error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User object and session
   */
  async login(email, password) {
    try {
      const user = await db.queryByIndex(db.STORES.USERS, 'email', email);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.password !== password) { // In production, compare hashed passwords
        throw new Error('Invalid password');
      }
      
      // Create a session
      const session = {
        user: { 
          id: user.id,
          email: user.email 
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      };
      
      // Store session in localStorage (could also use IndexedDB)
      localStorage.setItem('userSession', JSON.stringify(session));
      
      return { 
        session,
        user: {
          id: user.id,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Get current session
   * @returns {Promise<Object|null>} - Session object or null
   */
  async getSession() {
    try {
      const sessionStr = localStorage.getItem('userSession');
      if (!sessionStr) {
        return { data: { session: null } };
      }
      
      const session = JSON.parse(sessionStr);
      
      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem('userSession');
        return { data: { session: null } };
      }
      
      return { data: { session } };
    } catch (error) {
      console.error('Get session error:', error);
      Sentry.captureException(error);
      return { data: { session: null } };
    }
  },
  
  /**
   * Sign out a user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      localStorage.removeItem('userSession');
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Create a mock event emitter for auth state changes
   * @returns {Object} - Event emitter
   */
  onAuthStateChange(callback) {
    // Create a listener ID
    const listenerId = Date.now().toString();
    
    // Function to check for auth changes
    const checkAuth = () => {
      const sessionStr = localStorage.getItem('userSession');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      
      if (session && new Date(session.expiresAt) > new Date()) {
        callback('SIGNED_IN', session);
      } else {
        callback('SIGNED_OUT', null);
      }
    };
    
    // Initial check
    checkAuth();
    
    // Set up storage event listener to detect changes
    const storageListener = (e) => {
      if (e.key === 'userSession') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', storageListener);
    
    // Return unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            window.removeEventListener('storage', storageListener);
          }
        }
      }
    };
  }
};