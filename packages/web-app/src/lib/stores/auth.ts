// src/lib/stores/auth.ts
import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types/collection';
import { browser } from '$app/environment';

// Initial state
const initialState = {
  user: null as User | null,
  token: null as string | null,
  isAuthenticated: false
};

// Create the store
function createAuthStore() {
  const { subscribe, set, update } = writable(initialState);

  // Initialize from localStorage if available
  if (browser) {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        set({
          user,
          token: storedToken,
          isAuthenticated: true
        });
      } catch (e) {
        // Invalid stored data, clear it
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }

  return {
    subscribe,
    
    // Set user
    setUser: (user: User | null) => {
      update(state => {
        const newState = { ...state, user, isAuthenticated: !!user };
        
        if (browser) {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            localStorage.removeItem('user');
          }
        }
        
        return newState;
      });
    },
    
    // Set token
    setToken: (token: string | null) => {
      update(state => {
        const newState = { ...state, token };
        
        if (browser) {
          if (token) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
          }
        }
        
        return newState;
      });
    },
    
    // Set both user and token (for login)
    authenticate: (user: User, token: string) => {
      update(state => {
        const newState = { 
          user, 
          token, 
          isAuthenticated: true 
        };
        
        if (browser) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        }
        
        return newState;
      });
    },
    
    // Clear auth data (for logout)
    logout: () => {
      if (browser) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      set(initialState);
    },
    
    // Update user data
    updateUser: (updatedData: Partial<User>) => {
      update(state => {
        if (!state.user) return state;
        
        const updatedUser = { ...state.user, ...updatedData };
        
        if (browser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        return { ...state, user: updatedUser };
      });
    }
  };
}

// Export the store
export const auth = createAuthStore();

// Derived stores for convenience
export const currentUser = derived(auth, $auth => $auth.user);
export const isAuthenticated = derived(auth, $auth => $auth.isAuthenticated);
export const userRole = derived(auth, $auth => $auth.user?.role);